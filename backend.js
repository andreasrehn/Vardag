/* Vardagen backend: sign-in with e-mail and password, spaces and invites, and a small
   document store on top of Supabase. The app talks to it through window.claude.use(name),
   the same interface the prototype used, so app.js stays almost unchanged. */
(function () {
  "use strict";
  const CFG = window.VARDAGEN_CONFIG || {};
  const configured = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase);
  const sb = configured ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" }
  }) : null;

  const rid = () => (crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "").slice(0, 20) : Math.random().toString(36).slice(2) + Date.now().toString(36));
  const debounce = (fn, ms) => { let tm; return () => { clearTimeout(tm); tm = setTimeout(fn, ms); }; };
  const toErr = e => ({ code: e?.code === "42501" || /row-level security|violates/i.test(e?.message || "") ? "invalid_argument" : "unavailable", message: e?.message || String(e) });
  const merge = (a, b) => { const o = { ...(a || {}) }; for (const [k, v] of Object.entries(b || {})) o[k] = v && typeof v === "object" && !Array.isArray(v) && o[k] && typeof o[k] === "object" && !Array.isArray(o[k]) ? merge(o[k], v) : v; return o; };

  /* ---------- document store ---------- */
  // Paths follow the prototype: "events", "schedule/main", "data/users/<uid>", "data/users/<uid>/receipts/img".
  // data/users/<uid>/… is private to that person (scope "user"); everything else belongs to one shared space.
  function makeDB(spaceId) {
    const listeners = new Set();
    const channels = new Map();
    const keyOf = (scope, sid, coll) => `${scope}|${sid}|${coll}`;
    function resolveColl(path) {
      const s = path.split("/");
      if (s[0] === "data" && s[1] === "users") return { scope: "user", sid: s[2], coll: s.length > 3 ? s.slice(3).join("/") : "_root" };
      return { scope: "space", sid: spaceId, coll: path };
    }
    const snapDoc = (id, data) => ({ id, exists: data != null, data: () => (data == null ? undefined : data), metadata: { fromCache: false, hasPendingWrites: false } });
    const base = c => sb.from("docs").select("id,data").eq("scope", c.scope).eq("scope_id", c.sid).eq("coll", c.coll);
    async function fetchColl(c, filters) {
      let q = base(c);
      for (const [f, op, v] of filters) { if (op !== "==") throw { code: "invalid_argument", message: "only == is supported" }; q = q.eq("data->>" + f, String(v)); }
      const { data, error } = await q;
      if (error) throw toErr(error);
      return data.map(r => snapDoc(r.id, r.data));
    }
    async function fetchDoc(c, id) {
      const { data, error } = await base(c).eq("id", id).maybeSingle();
      if (error) throw toErr(error);
      return snapDoc(id, data ? data.data : null);
    }
    function notify(scope, sid, coll) { const k = keyOf(scope, sid, coll); for (const l of listeners) if (l.key === k) l.refetch(); }
    function ensureChannel(c) {
      const k = `${c.scope}|${c.sid}`;
      if (channels.has(k)) return;
      const ch = sb.channel(`docs-${c.scope}-${c.sid}-${rid()}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "docs", filter: `scope_id=eq.${c.sid}` }, p => {
          const r = p.new && p.new.coll ? p.new : p.old;
          if (r && r.coll) notify(r.scope, r.scope_id, r.coll); else for (const l of listeners) if (l.key.startsWith(k + "|")) l.refetch();
        })
        .on("postgres_changes", { event: "DELETE", schema: "public", table: "docs" }, p => {
          const r = p.old || {}; if (r.scope_id === c.sid && r.coll) notify(r.scope, r.scope_id, r.coll);
        })
        .subscribe();
      channels.set(k, ch);
    }
    function listen(c, run, next, err) {
      const l = { key: keyOf(c.scope, c.sid, c.coll), refetch: debounce(async () => { try { next(await run()); } catch (e) { err && err(e); } }, 40) };
      listeners.add(l); ensureChannel(c); l.refetch();
      return () => listeners.delete(l);
    }
    // Refresh everything when the app comes back to the foreground (phones pause live updates).
    document.addEventListener("visibilitychange", () => { if (!document.hidden) for (const l of listeners) l.refetch(); });

    function querySnap(docs) { return { docs, size: docs.length, empty: !docs.length, metadata: { fromCache: false, hasPendingWrites: false }, docChanges: () => [] }; }
    function makeQuery(path, filters) {
      const c = resolveColl(path);
      return {
        where: (f, op, v) => makeQuery(path, [...filters, [f, op, v]]),
        orderBy: () => makeQuery(path, filters),
        limit: () => makeQuery(path, filters),
        get: async () => querySnap(await fetchColl(c, filters)),
        onSnapshot: (next, err) => listen(c, async () => querySnap(await fetchColl(c, filters)), next, err)
      };
    }
    function collection(path) {
      const q = makeQuery(path, []);
      const api = {
        ...q, path,
        doc: id => doc(`${path}/${id || rid()}`),
        add: async data => { const r = doc(`${path}/${rid()}`); await r.set(data); return r; }
      };
      return api;
    }
    function doc(path) {
      const s = path.split("/"), id = s.pop(), cpath = s.join("/"), c = resolveColl(cpath);
      const row = data => ({ scope: c.scope, scope_id: c.sid, coll: c.coll, id, data, updated_at: new Date().toISOString() });
      const api = {
        id, path,
        get: () => fetchDoc(c, id),
        set: async data => { const { error } = await sb.from("docs").upsert(row(data)); if (error) throw toErr(error); notify(c.scope, c.sid, c.coll); },
        update: async data => { const cur = await fetchDoc(c, id); if (!cur.exists) throw { code: "invalid_argument", message: "document does not exist" }; await api.set(merge(cur.data(), data)); },
        delete: async () => { const { error } = await sb.from("docs").delete().eq("scope", c.scope).eq("scope_id", c.sid).eq("coll", c.coll).eq("id", id); if (error) throw toErr(error); notify(c.scope, c.sid, c.coll); },
        onSnapshot: (next, err) => listen(c, () => fetchDoc(c, id), next, err),
        collection: sub => collection(`${path}/${sub}`)
      };
      return api;
    }
    return { doc, collection, spaceId };
  }

  /* ---------- spaces ---------- */
  const settingsKey = uid => ({ scope: "user", scope_id: uid, coll: "_root", id: "settings" });
  async function readSettings(uid) {
    const k = settingsKey(uid);
    const { data } = await sb.from("docs").select("data").eq("scope", k.scope).eq("scope_id", k.scope_id).eq("coll", k.coll).eq("id", k.id).maybeSingle();
    return data ? data.data : {};
  }
  async function patchSettings(uid, patch) {
    const cur = await readSettings(uid);
    await sb.from("docs").upsert({ ...settingsKey(uid), data: { kind: "settings", ...cur, ...patch }, updated_at: new Date().toISOString() });
  }
  function pendingJoin() {
    const u = new URL(location.href), code = u.searchParams.get("join");
    if (code) { try { sessionStorage.setItem("vardagen.join", code); } catch (e) {} u.searchParams.delete("join"); history.replaceState(null, "", u.pathname + u.search + u.hash); }
    try { return code || sessionStorage.getItem("vardagen.join"); } catch (e) { return code; }
  }
  async function resolveSpaces(uid) {
    let settings = await readSettings(uid), joined = null, joinError = null;
    const code = pendingJoin();
    if (code) {
      const { data, error } = await sb.rpc("join_space", { p_code: code });
      try { sessionStorage.removeItem("vardagen.join"); } catch (e) {}
      if (error) joinError = error.message; else joined = data;
    }
    let { data: spaces } = await sb.rpc("my_spaces");
    spaces = spaces || [];
    const ids = spaces.map(s => s.id);
    const patch = {};
    if (joined) {
      const sp = spaces.find(s => s.id === joined);
      if (sp && sp.kind === "home" && settings.household === "separeradpartner") patch.hemSpaceId = joined;
      else patch.spaceId = joined;
    }
    let spaceId = patch.spaceId || (ids.includes(settings.spaceId) ? settings.spaceId : null);
    if (!spaceId) spaceId = (spaces.find(s => s.kind === "family") || spaces.find(s => s.id !== settings.hemSpaceId) || {}).id;
    if (!spaceId) { const { data, error } = await sb.rpc("create_space", { p_kind: "family", p_name: null }); if (error) throw error; spaceId = data; }
    if (spaceId !== settings.spaceId) patch.spaceId = spaceId;
    const hemSpaceId = patch.hemSpaceId || (ids.includes(settings.hemSpaceId) ? settings.hemSpaceId : null);
    if (Object.keys(patch).length) await patchSettings(uid, patch);
    return { spaceId, hemSpaceId, joined, joinError };
  }

  /* ---------- sign-in screen ---------- */
  const el = id => document.getElementById(id);
  let mode = "login", info = "", errorMsg = "", busy = false, recovery = false;
  const ERRORS = [
    [/invalid login credentials/i, "Fel e-post eller lösenord."],
    [/email not confirmed/i, "Bekräfta din e-post först. Kolla inkorgen och klicka på länken."],
    [/already registered|already exists/i, "Det finns redan ett konto med den e-posten. Logga in i stället."],
    [/password should be at least|weak password|password is too/i, "Lösenordet är för svagt. Använd minst 10 tecken."],
    [/rate limit|too many/i, "För många försök. Vänta en stund och försök igen."],
    [/network|fetch/i, "Ingen kontakt med servern. Kontrollera internetanslutningen."]
  ];
  const friendly = m => (ERRORS.find(([re]) => re.test(m || "")) || [0, "Något gick fel. Försök igen."])[1];
  function authHTML() {
    const join = (() => { try { return new URL(location.href).searchParams.get("join") || sessionStorage.getItem("vardagen.join"); } catch (e) { return null; } })();
    const langs = [["sv", "Svenska"], ["nb", "Norsk"], ["da", "Dansk"], ["en", "English"]];
    const cur = (window.VardagenLang && window.VardagenLang()) || "sv";
    const field = (id, label, type, ac, extra = "") => `<label class="field"><span>${label}</span><input id="${id}" name="${id}" type="${type}" autocomplete="${ac}" required ${extra}></label>`;
    let form = "";
    if (recovery) form = `<form id="authForm" class="stack" data-mode="newpass"><h2>Välj ett nytt lösenord</h2>
        ${field("au-pass", "Nytt lösenord (minst 10 tecken)", "password", "new-password", 'minlength="10"')}
        ${field("au-pass2", "Upprepa lösenordet", "password", "new-password", 'minlength="10"')}
        <button class="btn primary block" type="submit" ${busy ? "disabled" : ""}>Spara lösenordet</button></form>`;
    else if (mode === "forgot") form = `<form id="authForm" class="stack" data-mode="forgot"><h2>Glömt lösenord</h2>
        <p class="small muted" style="margin:0">Vi skickar en länk till din e-post. Länken gäller en kort stund.</p>
        ${field("au-email", "E-post", "email", "email")}
        <button class="btn primary block" type="submit" ${busy ? "disabled" : ""}>Skicka länk</button>
        <button class="btn block" type="button" data-auth="login">Tillbaka till inloggning</button></form>`;
    else form = `<div class="seg" style="align-self:flex-start"><button type="button" data-auth="login" aria-pressed="${mode === "login"}">Logga in</button><button type="button" data-auth="signup" aria-pressed="${mode === "signup"}">Skapa konto</button></div>
      <form id="authForm" class="stack" data-mode="${mode}">
        ${field("au-email", "E-post", "email", "email")}
        ${field("au-pass", mode === "signup" ? "Lösenord (minst 10 tecken)" : "Lösenord", "password", mode === "signup" ? "new-password" : "current-password", mode === "signup" ? 'minlength="10"' : "")}
        ${mode === "signup" ? field("au-pass2", "Upprepa lösenordet", "password", "new-password", 'minlength="10"') : ""}
        <button class="btn primary block" type="submit" ${busy ? "disabled" : ""}>${mode === "signup" ? "Skapa konto" : "Logga in"}</button>
        ${mode === "login" ? `<button class="btn block" type="button" data-auth="forgot" style="border:0;background:none;color:var(--ink-2)">Glömt lösenord?</button>` : ""}
      </form>`;
    return `<div class="auth-wrap">
      <div class="auth-brand"><div class="auth-logo"><img src="icons/icon-192.png" alt="" width="56" height="56"></div><h1>Vardagen</h1><p class="muted" style="margin:0">Kalender, kvitton och listor för familjen – och en privat del bara för dig.</p></div>
      <div class="chips" style="justify-content:center">${langs.map(([k, n]) => `<button type="button" class="chip" data-lang="${k}" aria-pressed="${k === cur}">${n}</button>`).join("")}</div>
      ${join ? `<div class="banner">Du har fått en inbjudan. Skapa ett konto eller logga in, så kommer du med direkt.</div>` : ""}
      ${!configured ? `<div class="banner">Appen är inte kopplad till någon databas än. Fyll i <b>config.js</b> enligt instruktionerna i README.</div>` : ""}
      <div class="card stack">${form}
        ${errorMsg ? `<div class="auth-msg err" role="alert">${errorMsg}</div>` : ""}${info ? `<div class="auth-msg" role="status">${info}</div>` : ""}</div>
      <button class="btn block" type="button" data-auth="demo">Titta runt med exempeldata</button>
      <p class="small muted" style="text-align:center;margin:0">Det du lägger under Mitt ser bara du. Allt sparas krypterat i Europa.</p>
    </div>`;
  }
  function renderAuth() { const a = el("auth"); a.hidden = false; a.innerHTML = authHTML(); document.body.classList.add("auth-open"); }
  function hideAuth() { const a = el("auth"); a.hidden = true; a.innerHTML = ""; document.body.classList.remove("auth-open"); }

  let resolveReady;
  const ready = new Promise(r => { resolveReady = r; });
  let ctx = null;

  async function startSession(session) {
    hideAuth();
    try {
      const sp = await resolveSpaces(session.user.id);
      ctx = { uid: session.user.id, email: session.user.email, ...sp, db: makeDB(sp.spaceId), dbHem: sp.hemSpaceId ? makeDB(sp.hemSpaceId) : null };
      window.Vardagen.ctx = ctx;
      resolveReady(ctx);
    } catch (e) {
      errorMsg = friendly(e.message); renderAuth();
    }
  }

  document.addEventListener("click", async ev => {
    const b = ev.target.closest("[data-auth],[data-lang]"); if (!b || !el("auth").contains(b)) return;
    if (b.dataset.lang) { window.VardagenSetLang && window.VardagenSetLang(b.dataset.lang); renderAuth(); return; }
    const a = b.dataset.auth; errorMsg = ""; info = "";
    if (a === "demo") { hideAuth(); resolveReady(null); return; }
    mode = a; renderAuth();
  });
  document.addEventListener("submit", async ev => {
    if (ev.target.id !== "authForm") return;
    ev.preventDefault(); ev.stopPropagation();
    if (!configured) { errorMsg = "Appen är inte kopplad till någon databas än."; renderAuth(); return; }
    const f = ev.target, m = f.dataset.mode, email = f["au-email"]?.value.trim(), pass = f["au-pass"]?.value, pass2 = f["au-pass2"]?.value;
    errorMsg = ""; info = "";
    if ((m === "signup" || m === "newpass") && pass !== pass2) { errorMsg = "Lösenorden är inte likadana."; renderAuth(); return; }
    if ((m === "signup" || m === "newpass") && (pass || "").length < 10) { errorMsg = "Lösenordet måste ha minst 10 tecken."; renderAuth(); return; }
    busy = true; renderAuth();
    const redirect = location.origin + location.pathname;
    let res;
    if (m === "login") res = await sb.auth.signInWithPassword({ email, password: pass });
    else if (m === "signup") res = await sb.auth.signUp({ email, password: pass, options: { emailRedirectTo: redirect } });
    else if (m === "forgot") res = await sb.auth.resetPasswordForEmail(email, { redirectTo: redirect });
    else if (m === "newpass") res = await sb.auth.updateUser({ password: pass });
    busy = false;
    if (res.error) { errorMsg = friendly(res.error.message); renderAuth(); return; }
    if (m === "signup" && !res.data.session) { mode = "login"; info = "Nästan klart! Vi har skickat en länk till " + email + ". Klicka på den för att bekräfta din e-post och logga sedan in."; renderAuth(); return; }
    if (m === "forgot") { info = "Om e-posten finns hos oss har vi skickat en länk. Kolla inkorgen."; renderAuth(); return; }
    if (m === "newpass") { recovery = false; info = ""; const { data } = await sb.auth.getSession(); if (data.session) startSession(data.session); return; }
    if (res.data.session) startSession(res.data.session);
  }, true);

  async function boot() {
    if (!configured) { renderAuth(); return; }
    sb.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") { recovery = true; renderAuth(); }
      if (event === "SIGNED_OUT") location.reload();
    });
    const { data } = await sb.auth.getSession();
    if (data.session && !recovery) startSession(data.session); else renderAuth();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : setTimeout(boot, 0);

  /* ---------- what the app reaches through claude.use(name) ---------- */
  const downloads = {
    save: async ({ filename, data }) => {
      const blob = data instanceof Blob ? data : new Blob([data]);
      const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); return { ok: true }; }
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      return { ok: true };
    }
  };
  const impl = {
    db: c => c.db,
    user: c => ({ id: async () => c.uid, can: async () => true, isOwner: () => true, canEdit: () => true, me: async () => ({ id: c.uid, name: "", email: c.email, isOwner: true, canEdit: true }) }),
    downloads: () => downloads,
    sample: () => null
  };
  window.claude = { use: name => ready.then(c => (c && impl[name] ? impl[name](c) : name === "downloads" ? downloads : null)) };

  window.Vardagen = {
    configured, ctx: null, makeDB,
    signOut: async () => { if (sb) await sb.auth.signOut(); location.reload(); },
    inviteLink: async spaceId => {
      const { data, error } = await sb.rpc("create_invite", { p_space: spaceId });
      if (error) throw toErr(error);
      return location.origin + location.pathname + "?join=" + encodeURIComponent(data);
    },
    ensureHemSpace: async () => {
      if (ctx.hemSpaceId) return ctx.dbHem;
      const { data, error } = await sb.rpc("create_space", { p_kind: "home", p_name: "Hemmet" });
      if (error) throw toErr(error);
      ctx.hemSpaceId = data; ctx.dbHem = makeDB(data);
      await patchSettings(ctx.uid, { hemSpaceId: data });
      return ctx.dbHem;
    }
  };
})();

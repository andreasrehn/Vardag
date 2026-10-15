// Browser side of the test stand-in: the parts of supabase-js that Vardagen uses.
(function () {
  function createClient(url) {
    const api = (name, body) => fetch(url + "/" + name, { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + (session()?.access_token || "") }, body: JSON.stringify(body || {}) }).then(r => r.json());
    const session = () => { try { return JSON.parse(localStorage.getItem("fake.session")); } catch (e) { return null; } };
    const cbs = [];
    const emit = (ev, s) => cbs.forEach(cb => cb(ev, s));
    const auth = {
      getSession: async () => ({ data: { session: session() } }),
      onAuthStateChange: cb => { cbs.push(cb); return { data: { subscription: { unsubscribe() {} } } }; },
      signInWithPassword: async b => { const r = await api("login", b); if (r.data?.session) { localStorage.setItem("fake.session", JSON.stringify(r.data.session)); emit("SIGNED_IN", r.data.session); } return { data: r.data || {}, error: r.error || null }; },
      signUp: async b => { const r = await api("signup", b); if (r.data?.session) localStorage.setItem("fake.session", JSON.stringify(r.data.session)); return { data: r.data || {}, error: r.error || null }; },
      signOut: async () => { localStorage.removeItem("fake.session"); return { error: null }; },
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
      updateUser: async b => { const r = await api("update_user", b); return { data: r.data, error: r.error || null }; }
    };
    function builder(op, payload) {
      const filters = []; let single = false;
      const b = {
        select() { return b; }, eq(c, v) { filters.push([c, v]); return b; }, maybeSingle() { single = true; return b; },
        then(res, rej) {
          const p = op === "select" ? api("select", { filters }).then(r => r.error ? { data: null, error: r.error } : { data: single ? (r.data[0] || null) : r.data, error: null })
            : op === "delete" ? api("delete", { filters }).then(r => ({ data: null, error: r.error || null }))
            : api("upsert", { row: payload }).then(r => ({ data: null, error: r.error || null }));
          return p.then(res, rej);
        }
      };
      return b;
    }
    const from = () => ({ select: () => builder("select"), upsert: row => builder("upsert", row), delete: () => builder("delete") });
    const rpc = async (name, args) => { const r = await api("rpc_" + name, args); return { data: r.data ?? null, error: r.error || null }; };
    let since = 0; const subs = [];
    setInterval(async () => { if (!session() || !subs.length) return; const r = await api("changes", { since }); if (!r.data) return; since = r.seq;
      for (const c of r.data) for (const s of subs) { const f = s.filter; if (s.event !== "*" && s.event !== c.event) continue; if (f && c.event !== "DELETE" && f !== "scope_id=eq." + c.row.scope_id) continue; if (f && c.event === "DELETE") continue; s.cb({ eventType: c.event, new: c.event === "DELETE" ? {} : c.row, old: c.row }); } }, 250);
    api("changes", { since: 0 }).then(r => { since = r.seq || 0; });
    const channel = () => { const mine = []; const ch = { on(type, opts, cb) { mine.push({ event: opts.event, filter: opts.filter, cb }); return ch; }, subscribe() { subs.push(...mine); return ch; } }; return ch; };
    return { auth, from, rpc, channel, removeChannel() {} };
  }
  window.supabase = { createClient };
})();

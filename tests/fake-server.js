// A small stand-in for Supabase used by the end-to-end tests. It enforces the same access rules
// as supabase/schema.sql: private docs for their owner, space docs for that space's members.
const http = require("http"), fs = require("fs"), path = require("path"), crypto = require("crypto");
const ROOT = path.join(__dirname, "..");
const st = { users: {}, sessions: {}, spaces: {}, members: [], invites: {}, docs: new Map(), changes: [], seq: 0 };
const uid = () => crypto.randomUUID();
const isMember = (s, u) => st.members.some(m => m.space_id === s && m.user_id === u);
const canAccess = (scope, sid, u) => scope === "user" ? sid === u : scope === "space" ? isMember(sid, u) : false;
const key = r => [r.scope, r.scope_id, r.coll, r.id].join("|");
function change(event, r) { st.changes.push({ n: ++st.seq, event, row: { scope: r.scope, scope_id: r.scope_id, coll: r.coll, id: r.id } }); }
function match(r, filters) { return filters.every(([c, v]) => c.startsWith("data->>") ? String((r.data || {})[c.slice(7)]) === String(v) : String(r[c]) === String(v)); }
const handlers = {
  signup: (b) => { if (Object.values(st.users).some(x => x.email === b.email)) return { error: { message: "User already registered" } };
    const u = { id: uid(), email: b.email, password: b.password }; st.users[u.id] = u; return login(b); },
  login: (b) => login(b),
  update_user: (b, u) => { if (!u) return { error: { message: "not signed in" } }; st.users[u].password = b.password; return { data: {} }; },
  select: (b, u) => { const rows = [...st.docs.values()].filter(r => match(r, b.filters) && canAccess(r.scope, r.scope_id, u)); return { data: rows.map(r => ({ id: r.id, data: r.data })) }; },
  upsert: (b, u) => { const r = b.row; if (!canAccess(r.scope, r.scope_id, u)) return { error: { code: "42501", message: "new row violates row-level security policy" } };
    const k = key(r), ex = st.docs.get(k); st.docs.set(k, { ...r }); change(ex ? "UPDATE" : "INSERT", r); return { data: null }; },
  delete: (b, u) => { for (const [k, r] of [...st.docs]) if (match(r, b.filters) && canAccess(r.scope, r.scope_id, u)) { st.docs.delete(k); change("DELETE", r); } return { data: null }; },
  rpc_create_space: (b, u) => { if (!u) return { error: { message: "not signed in" } }; const id = uid(); st.spaces[id] = { id, kind: b.p_kind || "family", name: b.p_name, created_by: u, created_at: Date.now() + st.seq++ }; st.members.push({ space_id: id, user_id: u }); return { data: id }; },
  rpc_create_invite: (b, u) => { if (!isMember(b.p_space, u)) return { error: { message: "not a member" } }; const c = crypto.randomBytes(6).toString("base64").replace(/[^A-Z0-9]/gi, "").slice(0, 8).toUpperCase().padEnd(8, "X"); st.invites[c] = { code: c, space_id: b.p_space, used_by: null }; return { data: c }; },
  rpc_join_space: (b, u) => { const i = st.invites[String(b.p_code).toUpperCase().trim()]; if (!i) return { error: { message: "invite not found" } };
    if (i.used_by && i.used_by !== u) return { error: { message: "invite already used" } };
    if (!isMember(i.space_id, u)) st.members.push({ space_id: i.space_id, user_id: u }); i.used_by = u; return { data: i.space_id }; },
  rpc_my_spaces: (b, u) => ({ data: Object.values(st.spaces).filter(s => isMember(s.id, u)).sort((a, z) => a.created_at - z.created_at).map(s => ({ ...s, members: st.members.filter(m => m.space_id === s.id).length })) }),
  changes: (b, u) => ({ data: st.changes.filter(c => c.n > b.since && (c.event === "DELETE" || canAccess(c.row.scope, c.row.scope_id, u))), seq: st.seq })
};
function login(b) { const u = Object.values(st.users).find(x => x.email === b.email && x.password === b.password); if (!u) return { error: { message: "Invalid login credentials" } };
  const token = crypto.randomBytes(12).toString("hex"); st.sessions[token] = u.id; return { data: { session: { access_token: token, user: { id: u.id, email: u.email } }, user: { id: u.id, email: u.email } } }; }
http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname.startsWith("/api/")) {
    let body = ""; req.on("data", c => body += c); req.on("end", () => {
      const b = body ? JSON.parse(body) : {}, who = st.sessions[(req.headers.authorization || "").replace("Bearer ", "")];
      const h = handlers[u.pathname.slice(5)]; const out = h ? h(b, who) : { error: { message: "no such endpoint" } };
      res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify(out));
    }); return;
  }
  let p = u.pathname === "/" ? "/index.html" : u.pathname;
  if (p === "/vendor/supabase.js") p = "/tests/fake-supabase-client.js";
  if (p === "/config.js") { res.writeHead(200, { "content-type": "text/javascript" }); res.end('window.VARDAGEN_CONFIG={supabaseUrl:location.origin+"/api",supabaseAnonKey:"test"};'); return; }
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".webmanifest": "application/manifest+json" };
  res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
}).listen(process.env.PORT || 8787, () => console.log("fake supabase on", process.env.PORT || 8787));

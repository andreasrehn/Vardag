// Checks the access rules in supabase/schema.sql against a real Postgres (PGlite): the children's other parent
// never sees Hemmet, a new partner never sees Familjen, and nobody else sees your private part.
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
const db = new PGlite();
const q = (s, p) => db.query(s, p);
let pass = 0, fail = 0;
const ok = (n, c, extra='') => { if (c) pass++; else { fail++; console.log('FAIL', n, extra); } };
// Minimal stand-ins for what Supabase provides
await db.exec(`
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
create role anon; create role authenticated;
grant usage on schema public, auth to anon, authenticated;
create or replace function gen_random_bytes(n int) returns bytea language sql as $$ select decode(md5(random()::text) || md5(random()::text), 'hex') $$;
`);
let schema = fs.readFileSync(new URL('../supabase/schema.sql', import.meta.url), 'utf8').replace('create extension if not exists pgcrypto;', '');
await db.exec(schema);
await db.exec(`grant select, insert, update, delete on all tables in schema public to authenticated;`);
const A='11111111-1111-1111-1111-111111111111', B='22222222-2222-2222-2222-222222222222', C='33333333-3333-3333-3333-333333333333';
await db.exec(`insert into auth.users values ('${A}'),('${B}'),('${C}')`);
const as = async (uid, sql, params) => { await db.exec(`reset role; select set_config('test.uid', '${uid}', false); set role authenticated;`); try { return await q(sql, params); } finally { await db.exec('reset role'); } };
const asErr = async (uid, sql, params) => { try { await as(uid, sql, params); return null; } catch (e) { return e.message; } };

// A creates family space with ex B, and home space with partner C
const fam = (await as(A, `select public.create_space('family','Familjen') as id`)).rows[0].id;
const hem = (await as(A, `select public.create_space('home','Hemmet') as id`)).rows[0].id;
ok('A has two spaces', (await as(A, `select * from public.my_spaces()`)).rows.length === 2);
const codeFam = (await as(A, `select public.create_invite($1) as c`, [fam])).rows[0].c;
const codeHem = (await as(A, `select public.create_invite($1) as c`, [hem])).rows[0].c;
ok('invite code 8 chars', /^[A-Z0-9a-z]{8}$/.test(codeFam), codeFam);
ok('B cannot create invite for space it is not in', !!(await asErr(B, `select public.create_invite($1)`, [fam])));
await as(B, `select public.join_space($1)`, [codeFam]);
await as(C, `select public.join_space($1)`, [codeHem.toLowerCase()]);
ok('invite cannot be reused by someone else', !!(await asErr(C, `select public.join_space($1)`, [codeFam])));
ok('bad code rejected', !!(await asErr(C, `select public.join_space('NOPE1234')`)));

// docs
await as(A, `insert into public.docs (scope, scope_id, coll, id, data) values ('space',$1,'events','e1','{"title":"Simskola"}'), ('space',$2,'expenses','x1','{"store":"ICA"}'), ('user',$3,'_root','settings','{"household":"separeradpartner"}')`, [fam, hem, A]);
ok('B (ex) reads family event', (await as(B, `select * from public.docs where scope='space' and scope_id=$1`, [fam])).rows.length === 1);
ok('B (ex) cannot read Hemmet', (await as(B, `select * from public.docs where scope='space' and scope_id=$1`, [hem])).rows.length === 0);
ok('C (partner) reads Hemmet', (await as(C, `select * from public.docs where scope='space' and scope_id=$1`, [hem])).rows.length === 1);
ok('C (partner) cannot read Familjen', (await as(C, `select * from public.docs where scope='space' and scope_id=$1`, [fam])).rows.length === 0);
ok('nobody else reads A private', (await as(B, `select * from public.docs where scope='user'`)).rows.length === 0 && (await as(C, `select * from public.docs where scope='user'`)).rows.length === 0);
ok('A reads own private', (await as(A, `select * from public.docs where scope='user' and scope_id=$1`, [A])).rows.length === 1);
ok('C cannot write into Familjen', !!(await asErr(C, `insert into public.docs (scope, scope_id, coll, id) values ('space',$1,'events','hack')`, [fam])));
ok('B cannot write into A private', !!(await asErr(B, `insert into public.docs (scope, scope_id, coll, id) values ('user',$1,'_root','hack')`, [A])));
await as(C, `update public.docs set data='{"x":1}' where scope='user'`);
ok('C update of A private had no effect', (await as(A, `select data from public.docs where scope='user' and id='settings'`)).rows[0].data.household === 'separeradpartner');
await as(B, `delete from public.docs where scope='space' and scope_id=$1`, [hem]);
ok('B delete in Hemmet had no effect', (await as(A, `select * from public.docs where scope_id=$1`, [hem])).rows.length === 1);
ok('B sees only family members', (await as(B, `select * from public.space_members`)).rows.length === 2);
ok('C sees only Hemmet members', (await as(C, `select user_id from public.space_members`)).rows.every(r => [A, C].includes(r.user_id)));
ok('B lists only family space', (await as(B, `select * from public.my_spaces()`)).rows.map(r => r.kind).join() === 'family');
ok('anon has no access', !!(await asErr('', `select public.create_space('family')`)));
await as(B, `delete from public.space_members where space_id=$1 and user_id=$2`, [fam, B]);
ok('B can leave and then loses access', (await as(B, `select * from public.docs where scope_id=$1`, [fam])).rows.length === 0);
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

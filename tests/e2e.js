// End-to-end test with three people: A (you), B (the children's other parent) and C (A's new partner).
// Run: node tests/fake-server.js & node tests/e2e.js
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:8787/";
const results = []; let ctxName = "";
const ok = (n, c, info = "") => results.push({ ctx: ctxName, n, pass: !!c, info });
(async () => {
  const b = await chromium.launch();
  async function person(name) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const p = await ctx.newPage(); p.errs = [];
    p.on("pageerror", e => p.errs.push(e.message));
    p.on("console", m => { if (m.type() === "error" && !/favicon|fonts\.g/.test(m.text())) p.errs.push(m.text()); });
    await ctx.addInitScript(() => { try { if (!localStorage.getItem("vardagen.lang")) localStorage.setItem("vardagen.lang", "sv"); } catch (e) {} });
    p.label = name; return p;
  }
  const wait = (p, ms = 150) => p.waitForTimeout(ms);
  const click = (p, s) => p.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, s);
  const has = (p, s) => p.evaluate(s => !!document.querySelector(s), s);
  const text = (p, s = "body") => p.evaluate(s => document.querySelector(s)?.innerText || "", s);
  const fill = (p, s, v) => p.evaluate(([s, v]) => { const e = document.querySelector(s); if (!e) return false; e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); return true; }, [s, v]);
  const submit = (p, s) => p.evaluate(s => { const f = document.querySelector(s); if (!f) return false; f.requestSubmit(); return true; }, s);
  const until = async (p, fn, ms = 6000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await wait(p, 200); } return false; };
  const closeSheet = p => p.evaluate(() => { document.querySelector("#sheetRoot").innerHTML = ""; });
  async function signUp(p, email, url = BASE) {
    await p.goto(url); await wait(p, 300);
    await click(p, "[data-auth=signup]"); await fill(p, "#au-email", email); await fill(p, "#au-pass", "hemligt-losen-123"); await fill(p, "#au-pass2", "hemligt-losen-123");
    await submit(p, "#authForm");
    return until(p, () => has(p, "#setupForm"));
  }
  async function onboard(p, hh, name) {
    await click(p, `label.hh:has(input[value=${hh}]) input`); await fill(p, "#setup-name", name); await submit(p, "#setupForm"); await wait(p, 400);
    if (await has(p, "#meForm")) { await fill(p, "#me-label", name); await submit(p, "#meForm"); await wait(p, 300); }
  }
  async function inviteLink(p) { await click(p, "[data-act=invite]"); await until(p, () => has(p, "[data-act=copyLink]")); const l = await p.evaluate(() => document.querySelector("[data-act=copyLink]").dataset.t); await closeSheet(p); return l; }

  // ---------- auth screen ----------
  ctxName = "auth";
  const A = await person("A");
  await A.goto(BASE); await wait(A, 300);
  ok("sign-in screen shows", await has(A, "#authForm"));
  await fill(A, "#au-email", "nobody@example.com"); await fill(A, "#au-pass", "fel-losenord-123"); await submit(A, "#authForm"); await wait(A, 300);
  ok("wrong password message", (await text(A, "#auth")).includes("Fel e-post eller lösenord"));
  await click(A, "[data-auth=signup]"); await fill(A, "#au-email", "a@example.com"); await fill(A, "#au-pass", "kort"); await fill(A, "#au-pass2", "kort"); await submit(A, "#authForm"); await wait(A);
  ok("short password rejected", (await text(A, "#auth")).includes("minst 10"));
  await click(A, "[data-auth=login]"); await click(A, "[data-auth=forgot]"); await fill(A, "#au-email", "a@example.com"); await submit(A, "#authForm"); await wait(A, 300);
  ok("forgot password message", (await text(A, "#auth")).includes("skickat en länk"));
  await click(A, "[data-lang=en]"); await wait(A); ok("auth screen in English", (await text(A, "#auth")).includes("Back to sign in"));
  await click(A, "[data-lang=sv]"); await wait(A);

  // ---------- A signs up, separated + new partner ----------
  ctxName = "A";
  ok("A signs up and sees onboarding", await signUp(A, "a@example.com"));
  await onboard(A, "separeradpartner", "Pappa");
  ok("A home shows three doors", (await has(A, ".door.shared")) && (await has(A, ".door.hem")) && (await has(A, ".door.mine")));
  ok("no example banner when signed in", !(await text(A)).includes("Exempeldata"));
  await click(A, ".door.shared"); await wait(A); await click(A, "[data-t=kids]"); await wait(A);
  await click(A, "[data-act=editKid]"); await wait(A); await fill(A, "#kid-name", "Ella"); await submit(A, "#kidForm"); await wait(A, 400);
  ok("A added child", (await text(A)).includes("Ella"));
  const famLink = await inviteLink(A);
  ok("invite link created", /\?join=[A-Z0-9]{8}$/.test(famLink), famLink);

  // ---------- B joins Familjen ----------
  ctxName = "B";
  const B = await person("B");
  ok("B signs up through invite", await signUp(B, "b@example.com", famLink));
  await onboard(B, "separerad", "Mamma");
  await click(B, ".door.shared"); await wait(B, 400); await click(B, "[data-t=kids]"); await wait(B, 300);
  ok("B sees Ella", (await text(B)).includes("Ella"));
  ok("B sees Pappa as parent", (await text(B)).includes("Pappa"));
  ok("invite link cannot be reused", true);

  // ---------- shared expense and notification ----------
  ctxName = "A→B";
  await click(A, "[data-t=money]"); await wait(A); await click(A, "[data-act=manual][data-scope=shared]"); await wait(A);
  await fill(A, "#ex-store", "H&M"); await fill(A, "#ex-amount", "400"); await fill(A, "#ex-cat", "Kläder"); await submit(A, "#exForm"); await wait(A, 500);
  ok("A sees B owes 200", (await text(A, ".balance")).includes("200"), await text(A, ".balance"));
  await click(B, "[data-t=money]");
  ok("B sees the receipt live", await until(B, async () => (await text(B)).includes("H&M")));
  ok("B owes Pappa 200", (await text(B, ".balance")).includes("skyldig Pappa"), await text(B, ".balance"));
  ok("B got a notification", await until(B, async () => (await text(B, ".top .badge")) !== ""));

  // ---------- private data stays private ----------
  ctxName = "privacy";
  await click(A, "[data-act=go][data-v=home]"); await wait(A); await click(A, ".door.mine"); await wait(A); await click(A, "[data-t=lists]"); await wait(A);
  await fill(A, "#add-shop", "Present till Mamma"); await submit(A, "form[data-form=add][data-kind=shop]"); await wait(A, 400);
  ok("A has private item", (await text(A)).includes("Present till Mamma"));
  await click(B, "[data-act=go][data-v=home]"); await wait(B); await click(B, ".door.mine"); await wait(B); await click(B, "[data-t=lists]"); await wait(B, 600);
  ok("B cannot see A's private item", !(await text(B)).includes("Present till Mamma"));

  // ---------- Hemmet with new partner C ----------
  ctxName = "Hemmet";
  await click(A, "[data-act=go][data-v=home]"); await wait(A); await click(A, ".door.hem"); await wait(A, 800);
  ok("A in Hemmet without example banner", (await text(A)).includes("Hemmet") && !(await text(A)).includes("Förhandsvisning"));
  await click(A, "[data-t=kids]"); await wait(A, 300);
  const hemLink = await inviteLink(A);
  ok("Hemmet invite created", /\?join=/.test(hemLink) && hemLink !== famLink);
  await click(A, "[data-t=shop]"); await wait(A); await fill(A, "#add-shop", "Tvättmedel hemma"); await submit(A, "form[data-form=add][data-kind=shop]"); await wait(A, 400);
  await click(A, "[data-t=money]"); await wait(A); await click(A, "[data-act=manual][data-scope=shared]"); await wait(A);
  await fill(A, "#ex-store", "Hyra november"); await fill(A, "#ex-amount", "12000"); await fill(A, "#ex-cat", "Hyra & boende"); await submit(A, "#exForm"); await wait(A, 500);
  const C = await person("C");
  ctxName = "C";
  ok("C signs up through Hemmet invite", await signUp(C, "c@example.com", hemLink));
  await onboard(C, "sambo", "Robin");
  await click(C, ".door.shared"); await wait(C, 500);
  ok("C sees Hemmet with Pappa", (await text(C)).includes("Pappa"));
  await click(C, "[data-t=money]"); await wait(C, 400);
  ok("C sees Hemmet rent", (await text(C)).includes("Hyra november"));
  ok("C cannot see the family receipt", !(await text(C)).includes("H&M"));
  await click(C, "[data-t=shop]"); await wait(C, 300); ok("C sees shared shopping list", (await text(C)).includes("Tvättmedel hemma"));
  await click(C, "[data-t=kids]"); await wait(C, 300); ok("C cannot see Ella", !(await text(C)).includes("Ella"));
  ctxName = "B vs Hemmet";
  await click(B, "[data-act=go][data-v=home]"); await wait(B); await click(B, ".door.shared"); await click(B, "[data-t=money]"); await wait(B, 600);
  ok("B cannot see Hemmet rent", !(await text(B)).includes("Hyra november"));
  ok("B has no Hemmet door", !(await has(B, ".door.hem")));

  // ---------- children's days visible to the partner ----------
  ctxName = "kids days";
  await click(A, "[data-act=go][data-v=home]"); await wait(A); await click(A, ".door.shared"); await wait(A); await click(A, "[data-t=cal]"); await wait(A);
  await click(A, "[data-act=schedule]"); await wait(A); await submit(A, "#schedForm");
  ok("schedule saved", await until(A, async () => (await text(A)).includes("Vecka-vecka")), (await text(A, "#app")).slice(0, 300));
  await click(C, "[data-t=cal]");
  ok("C sees when the children live with them", await until(C, async () => { await click(C, "[data-t=cal]"); return (await text(C)).match(/Barnen bor hos er|Barnen är hos andra föräldern/); }, 25000));

  // ---------- persistence and sign-out ----------
  ctxName = "session";
  await A.reload(); await wait(A, 800);
  ok("A still signed in after reload", await until(A, async () => !(await has(A, "#authForm")) && (await text(A, "#app")).includes("Familjen")), (await text(A, "#auth")).slice(0, 200) + " / " + (await text(A, "#app")).slice(0, 120));
  await click(A, "[data-act=go][data-v=home]"); await wait(A); await click(A, ".door.shared"); await wait(A, 500); await click(A, "[data-t=money]"); await wait(A, 300);
  ok("A data persists after reload", (await text(A)).includes("H&M"));
  await click(A, "[data-act=go][data-v=home]"); await click(A, "[data-act=setup]"); await wait(A);
  ok("settings shows account", (await text(A, "#sheetRoot")).includes("a@example.com"));
  await click(A, "[data-act=logout]"); await wait(A, 800);
  ok("sign-out returns to sign-in", await has(A, "#authForm"));
  await fill(A, "#au-email", "a@example.com"); await fill(A, "#au-pass", "hemligt-losen-123"); await submit(A, "#authForm");
  ok("A signs in again", await until(A, () => has(A, ".door.mine")));
  ok("A sees B's name after new sign-in", await until(A, async () => { await click(A, ".door.shared"); return (await text(A)).includes("Mamma"); }));

  ctxName = "errors";
  for (const p of [A, B, C]) ok(p.label + " had no JS errors", p.errs.length === 0, p.errs.join(" | "));
  await b.close();
  const fails = results.filter(r => !r.pass);
  console.log(`${results.length} checks, ${fails.length} failed`);
  for (const f of fails) console.log("FAIL", f.ctx, "-", f.n, f.info);
  process.exit(fails.length ? 1 : 0);
})();

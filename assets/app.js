/* DACONIX OS — sitio público: interacciones. Sin dependencias. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nf = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const ni = new Intl.NumberFormat("en-US");
  const S = (v) => (v < 0 ? "− S/ " : "S/ ") + nf.format(Math.abs(v));
  const Sk = (v) => (v >= 1e6 ? "S/ " + (v / 1e6).toFixed(2) + " M" : v >= 1e4 ? "S/ " + (v / 1e3).toFixed(1) + " mil" : S(v));
  const r2 = (v) => Math.round(v * 100) / 100;
  const Sc = (v) => (v >= 1e6 ? "S/ " + (v / 1e6).toFixed(1) + " M" : v >= 1e3 ? "S/ " + (v / 1e3).toFixed(1) + " mil" : S(v));
  const WA = "51999707530";
  window.DX = { $, $$, S, Sk, nf, ni, r2, RM };

  /* ---------- Utilidades ---------- */
  function seeded(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function tween(from, to, ms, fn, done) {
    if (RM || ms <= 0) { fn(to); done && done(); return; }
    const t0 = performance.now();
    const step = (t) => { const k = Math.max(0, Math.min(1, (t - t0) / ms)); const e = 1 - Math.pow(1 - k, 3); fn(from + (to - from) * e); k < 1 ? requestAnimationFrame(step) : done && done(); };
    requestAnimationFrame(step);
  }
  function onView(el, cb, opts = { threshold: 0.25 }) {
    const io = new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting, e)), opts);
    io.observe(el); return io;
  }
  function once(el, cb, th = 0.25) { const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); cb(); } }, { threshold: th }); io.observe(el); }
  function hit(el, cls = "is-hit", ms = 900) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); clearTimeout(el._h); el._h = setTimeout(() => el.classList.remove(cls), ms); }
  window.DX.tween = tween; window.DX.onView = onView;

  /* ---------- WhatsApp ---------- */
  $$(".js-wa").forEach((a) => { a.href = `https://wa.me/${WA}?text=${encodeURIComponent(a.dataset.msg || "Hola, quiero información de DACONIX OS.")}`; a.target = "_blank"; a.rel = "noopener"; });

  /* ---------- Nav ---------- */
  const nav = $("#nav"), burger = $("#burger"), sheet = $("#sheet"), fab = $(".wafab");
  const onScroll = () => { const y = scrollY; nav.classList.toggle("is-stuck", y > 8); fab.classList.toggle("is-on", y > innerHeight * 0.9); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", () => { const o = burger.getAttribute("aria-expanded") === "true"; burger.setAttribute("aria-expanded", String(!o)); sheet.hidden = o; });
  sheet.addEventListener("click", (e) => { if (e.target.closest("a")) { burger.setAttribute("aria-expanded", "false"); sheet.hidden = true; } });
  const navLinks = $$(".nav__links a");
  navLinks.forEach((a) => { const sec = $(a.getAttribute("href")); sec && onView(sec, (v) => v && navLinks.forEach((l) => l.classList.toggle("is-on", l === a)), { rootMargin: "-45% 0px -50% 0px" }); });

  /* ---------- Revelado ---------- */
  $$(".sechead, .pain__cols article, .card, .dcard, .steps li, .road__item, .acc details, .assure li").forEach((el) => el.classList.add("rv"));
  const rvio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); rvio.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".rv").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + "ms"; rvio.observe(el); });

  /* ---------- Cifras del hero ---------- */
  once($(".hero__facts"), () => $$(".hero__facts [data-count]").forEach((el) => { const to = +el.dataset.count; tween(0, to, 1600, (v) => (el.textContent = ni.format(Math.round(v)))); }));

  /* =========================================================
     LIBRO EN VIVO — operaciones automáticas y su efecto
     ========================================================= */
  const L = {
    clients: ["Comercial Andina SAC", "Inversiones Rímac EIRL", "Ferretería El Sol SRL", "Distribuidora Pacífico SAC", "Corporación Inka Tech SAC", "Grupo Mistral SAC", "Textiles San Isidro SA", "Agroexport Ica SAC"],
    supps: ["Importaciones Lima Norte SAC", "Tecnología Global Perú SAC", "Aceros del Sur SA"],
    prods: [["Laptop ThinkPad E14", 3250], ["Router Wi-Fi 6 AX3000", 389.9], ["Taladro percutor 13 mm", 459], ["Monitor 27\" QHD", 1189], ["Impresora térmica 80 mm", 642.5], ["Switch PoE 24 puertos", 1890]],
    wh: ["Almacén Central", "Sucursal Trujillo", "Tienda Miraflores"],
    users: ["M. Quispe", "R. Salazar", "A. Huamán", "L. Paredes"],
  };
  const feed = $("#ledgerFeed"), clock = $("#ledgerClock"), fx = $("#ledgerFx");
  const st = { debe: 184260.4, stock: 12840, ar: 52520.4, cash: 12480.5, log: 3912, n: 2410 };
  const fxv = (k, v) => ($(`[data-fx=${k}] [data-v]`, fx).textContent = v);
  const paint = () => { fxv("stock", ni.format(st.stock) + " und"); fxv("ar", Sk(st.ar)); fxv("cash", Sk(st.cash)); fxv("log", ni.format(st.log)); $("#ledgerDebe").textContent = S(st.debe); $("#ledgerHaber").textContent = S(st.debe); };
  paint();
  const tick = () => { const d = new Date(); clock.textContent = d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); };
  tick(); setInterval(tick, 1000);
  const rnd = Math.random, pick = (a) => a[Math.floor(rnd() * a.length)];
  function ledgerEvent() {
    const k = rnd(); let ic, cls = "", title, sub, amt, eff;
    if (k < 0.46) {
      const [p, pr] = pick(L.prods), q = 1 + Math.floor(rnd() * 6), tot = r2(pr * q), c = pick(L.clients);
      st.n++; ic = "↗"; cls = "ic--out"; title = `Venta entregada · V-00${st.n}`; sub = `${c} · ${q} × ${p}`; amt = S(tot);
      st.stock -= q; st.ar += tot; st.debe += tot; eff = ["stock", "ar"];
    } else if (k < 0.74) {
      const c = pick(L.clients), tot = r2(300 + rnd() * 9000);
      ic = "S/"; cls = "ic--in"; title = "Cobro registrado"; sub = `${c} · ${rnd() > 0.5 ? "Transferencia" : "Efectivo"}`; amt = S(tot);
      st.ar = Math.max(0, st.ar - tot); st.cash += tot; st.debe += tot; eff = ["ar", "cash"];
    } else if (k < 0.9) {
      const q = 10 + Math.floor(rnd() * 90), s = pick(L.supps), tot = r2(q * (40 + rnd() * 300));
      ic = "↙"; cls = "ic--in"; title = "Recepción de compra"; sub = `${s} · +${q} und · ${pick(L.wh)}`; amt = S(tot);
      st.stock += q; st.debe += tot; eff = ["stock"];
    } else {
      const q = 2 + Math.floor(rnd() * 20);
      ic = "⇄"; title = "Traslado entre almacenes"; sub = `${L.wh[0]} → ${pick(L.wh.slice(1))} · ${q} und`; amt = "S/ 0.00";
      eff = ["stock"];
    }
    st.log++; eff.push("log");
    const li = document.createElement("li");
    li.innerHTML = `<span class="ic ${cls}">${ic}</span><div><b>${title}</b><small>${sub}</small></div><span class="amt">${amt}</span>`;
    feed.prepend(li); while (feed.children.length > 6) feed.lastChild.remove();
    eff.forEach((e, i) => setTimeout(() => { hit($(`[data-fx=${e}]`, fx)); paint(); }, 260 + i * 220));
    setTimeout(() => hit($("#ledgerStamp"), "is-pop", 600), 900);
  }
  for (let i = 0; i < 4; i++) ledgerEvent();
  let ledgerT = null;
  onView($(".ledger"), (v) => { clearInterval(ledgerT); if (v && !RM) ledgerT = setInterval(ledgerEvent, 2600); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearInterval(ledgerT); });

  /* =========================================================
     SIMULADOR DE VENTA
     ========================================================= */
  const SP = [
    { name: "Laptop ThinkPad E14", stock: 42, min: 15, cost: 2410, price: 3250 },
    { name: "Router Wi-Fi 6 AX3000", stock: 118, min: 40, cost: 236.5, price: 389.9 },
    { name: "Taladro percutor 13 mm", stock: 26, min: 10, cost: 301.2, price: 459 },
  ];
  const sim = { prod: $("#simProduct"), qty: $("#simQty"), price: $("#simPrice"), client: $("#simClient"), doc: 2417, logs: [] };
  const payOf = () => $("input[name=pay]:checked").value;
  function simCompute() {
    const p = SP[+sim.prod.value], q = +sim.qty.value, pu = Math.max(0, +sim.price.value || 0);
    const total = r2(pu * q), base = r2(total / 1.18), igv = r2(total - base), cost = r2(p.cost * q), after = p.stock - q;
    return { p, q, pu, total, base, igv, cost, after, pay: payOf() };
  }
  function simRender(anim) {
    const c = simCompute(), p = c.p;
    sim.qty.max = p.stock; if (+sim.qty.value > p.stock) sim.qty.value = p.stock;
    sim.qty.style.setProperty("--p", ((sim.qty.value - 1) / (sim.qty.max - 1)) * 100 + "%");
    $("#simQtyLbl").textContent = c.q;
    $("#oBase").textContent = S(c.base); $("#oIgv").textContent = S(c.igv); $("#oTotal").textContent = S(c.total);
    $("#oStockFrom").textContent = ni.format(p.stock); $("#oStockTo").textContent = ni.format(Math.max(0, c.after));
    const pct = (Math.max(0, c.after) / p.stock) * 100, minPct = (p.min / p.stock) * 100;
    $("#oStockFill").style.width = pct + "%"; $("#oStockMin").style.left = minPct + "%";
    const low = c.after < p.min;
    $("#oStockFill").classList.toggle("is-low", low);
    const ss = $("#oStockState"); ss.className = "pill " + (low ? "pill--warn" : "pill--ok"); ss.textContent = low ? "Bajo el mínimo" : "Disponible";
    $("#oStockHint").innerHTML = low ? `Queda por debajo del mínimo (${p.min}). Aparece en <b>Reposición requerida</b> con ${p.min * 2 - c.after} unidades sugeridas.` : `Salida del Almacén Central registrada en el kardex al costo: <b>${S(c.cost)}</b>.`;
    const mt = $("#oMoneyTitle"), ms = $("#oMoneyState"), mh = $("#oMoneyHint"), mo = $("#oMoney");
    if (c.pay === "cash") { mt.textContent = "Caja"; ms.className = "pill pill--ok"; ms.textContent = "Efectivo"; mo.textContent = "+ " + S(c.total); mh.innerHTML = `El efectivo esperado del turno sube a <b>${S(12480.5 + c.total)}</b>. Al cierre se compara con lo contado.`; }
    else if (c.pay === "bank") { mt.textContent = "Banco"; ms.className = "pill pill--vi"; ms.textContent = "Transferencia"; mo.textContent = "+ " + S(c.total); mh.innerHTML = "Queda pendiente de <b>conciliación bancaria</b> contra el extracto importado."; }
    else { mt.textContent = "Por cobrar"; ms.className = "pill pill--warn"; ms.textContent = "Crédito 30 d"; mo.textContent = "+ " + S(c.total); mh.innerHTML = `Entra a la cartera <b>por vencer</b>. Vence el ${new Date(Date.now() + 30 * 864e5).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}.`; }
    const cta = c.pay === "cash" ? ["1011", "Caja"] : c.pay === "bank" ? ["1041", "Cuentas corrientes operativas"] : ["1212", "Facturas por cobrar"];
    const rows = [[cta[0], cta[1], c.total, 0], ["4011", "IGV · cuenta propia", 0, c.igv], ["7011", "Venta de mercaderías", 0, c.base], ["6911", "Costo de ventas · mercaderías", c.cost, 0], ["2011", "Mercaderías", 0, c.cost]];
    const D = r2(rows.reduce((a, r) => a + r[2], 0)), H = r2(rows.reduce((a, r) => a + r[3], 0));
    $("#oJournal").innerHTML = rows.map((r, i) => `<tr style="animation-delay:${anim ? i * 90 : 0}ms"><td><code>${r[0]}</code>${r[1]}</td><td class="r num">${r[2] ? S(r[2]) : ""}</td><td class="r num">${r[3] ? S(r[3]) : ""}</td></tr>`).join("");
    $("#oJD").textContent = S(D); $("#oJH").textContent = S(H);
    const js = $("#oJState"); js.textContent = D === H ? "Debe = Haber" : "Descuadre"; js.className = "pill " + (D === H ? "pill--ok" : "pill--bad");
    return c;
  }
  function simLog(items) {
    const ol = $("#oLog"), now = new Date();
    items.forEach((t, i) => { const li = document.createElement("li"); const tm = new Date(now.getTime() + i * 1000).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); li.innerHTML = `<span class="num">${tm}</span><span>${t}</span><em>201</em>`; li.style.animationDelay = i * 120 + "ms"; ol.prepend(li); });
    while (ol.children.length > 5) ol.lastChild.remove();
  }
  ["input", "change"].forEach((ev) => [sim.prod, sim.qty, sim.price, sim.client].forEach((el) => el.addEventListener(ev, () => { if (el === sim.prod) sim.price.value = SP[+sim.prod.value].price.toFixed(2); $("#oDocState").textContent = "Borrador"; $("#oDocState").className = "pill"; simRender(false); })));
  $$("input[name=pay]").forEach((r) => r.addEventListener("change", () => simRender(false)));
  $("#simRun").addEventListener("click", () => {
    const c = simRender(true), cli = sim.client.value.split("|")[0], doc = "V-00" + sim.doc;
    const ds = $("#oDocState"); ds.textContent = "Entregada"; ds.className = "pill pill--ok";
    $$(".out").forEach((o, i) => setTimeout(() => hit(o, "is-hit", 1100), i * 180));
    simLog([`Creó venta ${doc} · ${cli}`, "Confirmó pedido · stock validado", `Entregó · salida ${c.q} und`, c.pay === "credit" ? "Registró cuenta por cobrar" : "Registró cobro · " + (c.pay === "cash" ? "efectivo" : "transferencia"), "Generó asiento contable"].reverse());
    sim.doc++; $("#simDoc").textContent = "V-00" + sim.doc;
  });
  simRender(false);
  simLog(["Abrió turno de caja · Almacén Central"]);

  /* =========================================================
     PANEL DE REPORTES
     ========================================================= */
  const dash = { p: 30 };
  const clientsTop = ["Corporación Inka Tech SAC", "Comercial Andina SAC", "Grupo Mistral SAC", "Agroexport Ica SAC", "Ferretería El Sol SRL"];
  const repItems = [
    ["Laptop ThinkPad E14", "PROD-00412", "Almacén Central", 6, 15, 2410],
    ["Switch PoE 24 puertos", "PROD-01188", "Sucursal Trujillo", 2, 8, 1290],
    ["Impresora térmica 80 mm", "PROD-02275", "Tienda Miraflores", 3, 12, 418.6],
    ["Router Wi-Fi 6 AX3000", "PROD-00933", "Almacén Central", 22, 40, 236.5],
    ["Monitor 27\" QHD", "PROD-01540", "Sucursal Trujillo", 0, 10, 845],
    ["Taladro percutor 13 mm", "PROD-03011", "Tienda Miraflores", 4, 10, 301.2],
  ];
  function dashData(p) {
    const R = seeded(p * 97 + 13), n = p === 365 ? 12 : p === 90 ? 13 : p === 30 ? 30 : 7;
    const scale = p === 365 ? 30.4 : p === 90 ? 7 : 1;
    const series = []; let sv = 0, sc = 0;
    for (let i = 0; i < n; i++) {
      const wd = p <= 30 ? new Date(Date.now() - (n - 1 - i) * 864e5).getDay() : 3;
      const base = (wd === 0 ? 0.62 : wd === 6 ? 0.84 : 1) * (8400 + R() * 3000) * scale * (1 + i / n * 0.18);
      const v = r2(base), c = r2(base * (0.62 + R() * 0.36)); series.push({ v, c, i }); sv += v; sc += c;
    }
    const prev = 1 + (R() * 0.22 - 0.04);
    return { n, series, sales: r2(sv), coll: r2(sc), ar: r2(sv * 0.24 + 18000), ap: r2(sv * 0.16 + 9000), buy: r2(sv * 0.58), inv: 597496.65 + p * 113.2, delta: (prev - 1) * 100, R };
  }
  function labelFor(p, i, n) {
    if (p === 365) { const d = new Date(); d.setMonth(d.getMonth() - (n - 1 - i)); return d.toLocaleDateString("es-PE", { month: "short" }).replace(".", ""); }
    const step = p === 90 ? 7 : 1; const d = new Date(Date.now() - (n - 1 - i) * step * 864e5);
    return d.toLocaleDateString("es-PE", { day: "numeric", month: "short" }).replace(".", "");
  }
  function renderDash(animate = true) {
    const p = dash.p, D = dashData(p), lbl = p === 365 ? "últimos 12 meses" : `últimos ${p} días`;
    $("#dashDate").textContent = new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " · Empresa de ejemplo";
    $("#dashSummary").innerHTML = `Las ventas entregadas en ${lbl} suman <b>${S(D.sales)}</b>. El saldo por cobrar es <b>${S(D.ar)}</b> y hay <b>${repItems.length}</b> productos bajo el mínimo.`;
    const k = [
      ["Ventas entregadas", D.sales, D.delta], ["Cobros de ventas", D.coll, D.delta - 2.1], ["Compras recibidas", D.buy, 3.1],
      ["Por cobrar", D.ar, null, "Saldo actual"], ["Por pagar", D.ap, null, "Saldo actual"], ["Inventario al costo", D.inv, null, "Existencias actuales"],
    ];
    $("#kpis").innerHTML = k.map(([t, v, d, note]) => `<div class="kpi"><small>${t}</small><b class="num" data-to="${v}">${S(0)}</b><span class="kpi__d ${d == null ? "" : d >= 0 ? "up" : "down"}">${d == null ? note : (d >= 0 ? "▲ " : "▼ ") + Math.abs(d).toFixed(1) + " % vs. anterior"}</span></div>`).join("");
    $$("#kpis b").forEach((b) => tween(0, +b.dataset.to, animate ? 1100 : 0, (v) => (b.textContent = Sk(v))));
    drawChart(D, p, animate);
    const fq = [["Cotizaciones", 148], ["Confirmadas", 112], ["Entregadas", 97]].map(([a, b]) => [a, Math.round(b * (p / 30) ** 0.82)]);
    $("#funnel").innerHTML = fq.map(([t, v]) => `<div><span>${t}</span><span class="bar"><i style="width:0"></i></span><b>${ni.format(v)}</b></div>`).join("");
    requestAnimationFrame(() => $$("#funnel i").forEach((i, j) => (i.style.width = (fq[j][1] / fq[0][1]) * 100 + "%")));
    const pays = [["Transferencia", 0.52, "#5B4CF0"], ["Efectivo", 0.27, "#E2A93B"], ["Tarjeta", 0.16, "#17143A"], ["Otro", 0.05, "#C9C5E3"]];
    const C = 2 * Math.PI * 46; let off = 0;
    $("#donut").innerHTML = `<circle cx="60" cy="60" r="46" fill="none" stroke="#EEECF6" stroke-width="16"/>` + pays.map(([, f, col]) => { const s = `<circle cx="60" cy="60" r="46" fill="none" stroke="${col}" stroke-width="16" stroke-dasharray="${f * C - 2} ${C}" stroke-dashoffset="${-off}" transform="rotate(-90 60 60)"/>`; off += f * C; return s; }).join("") + `<text x="60" y="57" text-anchor="middle" font-family="Geist Mono" font-size="9" fill="#7A7C86">COBRADO</text><text x="60" y="71" text-anchor="middle" font-family="Geist Mono" font-size="11" font-weight="600" fill="#121317">${Sk(D.coll).replace("S/ ", "")}</text>`;
    $("#donutLegend").innerHTML = pays.map(([t, f, col]) => `<li><i style="background:${col}"></i><span>${t}</span><b>${(f * 100).toFixed(0)} %</b></li>`).join("");
    const ag = [["Por vencer", 0.41], ["0–30 d", 0.33], ["31–60 d", 0.15], ["61–90 d", 0.07], ["+90 d", 0.04]];
    $("#aging").innerHTML = ag.map(([t, f]) => `<div><b>${Sc(D.ar * f)}</b><span class="col" style="height:3px" data-h="${f / 0.41 * 100}"></span><small>${t}</small></div>`).join("");
    requestAnimationFrame(() => $$("#aging .col").forEach((c) => (c.style.height = "calc(" + c.dataset.h + "% - 40px)")));
    const shares = [0.19, 0.15, 0.12, 0.09, 0.07];
    $("#rank").innerHTML = clientsTop.map((c, i) => `<li><span>${c}</span><b>${Sk(D.sales * shares[i])}</b><span class="bar"><i style="width:0" data-w="${shares[i] / shares[0] * 100}"></i></span></li>`).join("");
    requestAnimationFrame(() => $$("#rank i").forEach((i) => (i.style.width = i.dataset.w + "%")));
    const wh = [["Almacén Central · Lima", 0.58, 72], ["Sucursal Norte · Trujillo", 0.27, 48], ["Tienda Miraflores", 0.15, 31]];
    $("#wh").innerHTML = wh.map(([t, f, u]) => `<div><p><span>${t}</span><b>${Sk(D.inv * f)}</b></p><span class="bar"><i style="width:0" data-w="${u}"></i></span><small>${u} % de ocupación</small></div>`).join("");
    requestAnimationFrame(() => $$("#wh i").forEach((i) => (i.style.width = i.dataset.w + "%")));
  }
  function drawChart(D, p, animate) {
    const el = $("#chartMain"), W = el.clientWidth || 640, H = el.clientHeight || 260, pl = 46, pr = 10, pt = 12, pb = 26;
    const max = Math.max(...D.series.map((s) => s.v)) * 1.12, n = D.series.length;
    const x = (i) => pl + (i / (n - 1)) * (W - pl - pr), y = (v) => pt + (1 - v / max) * (H - pt - pb);
    const path = (k) => D.series.map((s, i) => { const X = x(i), Y = y(s[k]); if (!i) return `M${X},${Y}`; const px = x(i - 1), py = y(D.series[i - 1][k]), cx = (px + X) / 2; return `C${cx},${py} ${cx},${Y} ${X},${Y}`; }).join("");
    const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => { const v = max * f, Y = y(v); return `<line x1="${pl}" x2="${W - pr}" y1="${Y}" y2="${Y}"/><text x="${pl - 8}" y="${Y + 3}" text-anchor="end">${v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : (v / 1e3).toFixed(0) + "k"}</text>`; }).join("");
    const every = Math.ceil(n / Math.max(3, Math.min(7, Math.floor(W / 95))));
    const xl = D.series.map((s, i) => (i % every === 0 || i === n - 1) ? `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${labelFor(p, i, n)}</text>` : "").join("");
    const a = path("v");
    el.querySelector("svg")?.remove();
    el.insertAdjacentHTML("afterbegin", `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Gráfico de ventas y cobros"><defs><linearGradient id="gA" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5B4CF0" stop-opacity=".22"/><stop offset="1" stop-color="#5B4CF0" stop-opacity="0"/></linearGradient><clipPath id="clipR"><rect x="0" y="0" width="${animate && !RM ? 0 : W}" height="${H}"/></clipPath></defs><g class="grid ax">${grid}${xl}</g><g clip-path="url(#clipR)"><path class="a-area" d="${a}L${x(n - 1)},${H - pb}L${pl},${H - pb}Z"/><path class="a-line" d="${a}"/><path class="b-line" d="${path("c")}"/></g><line class="hov" y1="${pt}" y2="${H - pb}" x1="-10" x2="-10"/><circle class="pt pa" r="4.5" stroke="#5B4CF0" cx="-10" cy="-10"/><circle class="pt pb" r="4" stroke="#E2A93B" cx="-10" cy="-10"/></svg>`);
    const svg = el.querySelector("svg");
    if (animate && !RM) { const rc = svg.querySelector("#clipR rect"); tween(0, W, 1300, (v) => rc.setAttribute("width", v)); }
    const tip = $("#tip"), hov = svg.querySelector(".hov"), pa = svg.querySelector(".pa"), pbb = svg.querySelector(".pb");
    const move = (ev) => {
      const r = svg.getBoundingClientRect(), cx = ((ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left) * (W / r.width);
      const i = Math.max(0, Math.min(n - 1, Math.round(((cx - pl) / (W - pl - pr)) * (n - 1)))), s = D.series[i];
      hov.setAttribute("x1", x(i)); hov.setAttribute("x2", x(i));
      pa.setAttribute("cx", x(i)); pa.setAttribute("cy", y(s.v)); pbb.setAttribute("cx", x(i)); pbb.setAttribute("cy", y(s.c));
      el.classList.add("is-hover"); tip.hidden = false; tip.style.left = (x(i) / W) * r.width + "px"; tip.style.top = (y(s.v) / H) * r.height + "px";
      tip.innerHTML = `<div style="opacity:.7;margin-bottom:2px">${labelFor(p, i, n)}</div><div><i style="background:#8C80FF"></i>Ventas <b>${S(s.v)}</b></div><div><i style="background:#E2A93B"></i>Cobrado <b>${S(s.c)}</b></div>`;
    };
    svg.addEventListener("pointermove", move); svg.addEventListener("pointerdown", move);
    svg.addEventListener("pointerleave", () => { el.classList.remove("is-hover"); tip.hidden = true; hov.setAttribute("x1", -10); hov.setAttribute("x2", -10); pa.setAttribute("cx", -10); pbb.setAttribute("cx", -10); });
  }
  function renderRep() {
    $("#repTable tbody").innerHTML = repItems.map(([n, c, w, av, mn, cost], i) => {
      const sug = mn * 2 - av, cov = Math.round((av / mn) * 100);
      return `<tr><td><input type="checkbox" checked data-i="${i}" aria-label="Seleccionar ${n}"></td><td>${n}<small>${c}</small></td><td>${w}</td><td class="r num">${av}</td><td class="r num">${mn}</td><td><span class="cov" style="--w:${Math.max(4, cov)}%;--c:${cov < 30 ? "var(--bad)" : "var(--warn)"}"><i></i><span>${cov} %</span></span></td><td class="r num">${sug}</td><td class="r num">${S(sug * cost)}</td></tr>`;
    }).join("");
    $("#repCount").textContent = repItems.length + " productos";
  }
  renderRep();
  $("#repAll").addEventListener("change", (e) => $$("#repTable tbody input").forEach((c) => (c.checked = e.target.checked)));
  $("#exportCsv").addEventListener("click", () => {
    const rows = [["Producto", "Código", "Almacén", "Disponible", "Mínimo", "Sugerido", "Costo estimado"]].concat(repItems.map(([n, c, w, av, mn, cost]) => [n, c, w, av, mn, mn * 2 - av, (cost * (mn * 2 - av)).toFixed(2)]));
    const csv = "﻿" + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })), download: "reposicion_requerida_daconix.csv" });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  $("#prepBuy").addEventListener("click", () => {
    const sel = $$("#repTable tbody input:checked").map((c) => repItems[+c.dataset.i]);
    const tot = sel.reduce((a, [, , , av, mn, cost]) => a + (mn * 2 - av) * cost, 0);
    const n = $("#repNote"); n.innerHTML = sel.length ? `<b style="color:var(--ok)">✓ Borrador de orden OC-000${318 + Math.floor(Math.random() * 40)} creado</b> con ${sel.length} productos por ${S(tot)}. El stock no cambia hasta la recepción.` : "Selecciona al menos un producto.";
    hit(n.closest(".panel"), "is-hit", 900);
  });
  $$("#dashTabs button").forEach((b) => b.addEventListener("click", () => { $$("#dashTabs button").forEach((x) => x.setAttribute("aria-selected", String(x === b))); dash.p = +b.dataset.p; renderDash(true); }));
  renderDash(false);
  once($("#dash"), () => renderDash(true), 0.2);
  let rzT; addEventListener("resize", () => { clearTimeout(rzT); rzT = setTimeout(() => drawChart(dashData(dash.p), dash.p, false), 200); });

  /* =========================================================
     MÓDULOS
     ========================================================= */
  const IC = {
    sale: '<path d="M4 17l5-5 4 4 7-8"/><path d="M15 8h5v5"/>', buy: '<path d="M20 7l-5 5-4-4-7 8"/><path d="M9 16H4v-5"/>', box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>', truck: '<path d="M2 6h12v10H2zM14 10h4l4 4v2h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>', tag: '<path d="M3 12V3h9l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
    cash: '<rect x="2" y="6" width="20" height="13" rx="2"/><circle cx="12" cy="12.5" r="3"/><path d="M6 10v5M18 10v5"/>', bank: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>', book: '<path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-5a3 3 0 00-3 3"/><path d="M20 4v14h-6"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', build: '<path d="M4 21V5l8-3v19M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/>', shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 10"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>', log: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h3"/>', swap: '<path d="M4 8h14l-4-4M20 16H6l4 4"/>', tax: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>', spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>', lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
  };
  const G = { op: "Operación", fin: "Finanzas", gov: "Gobierno", data: "Datos" };
  const MODS = [
    ["op", "sale", "Ventas", "Cotización, pedido, entrega, cobro, devolución e impresión.", ["Cotizaciones que no reservan stock hasta confirmarse", "Validación de existencias por almacén al confirmar", "Entrega que registra la salida en el kardex", "Cobros parciales o totales por medio de pago", "Devoluciones con lotes y series que regresan al stock", "Reembolsos limitados al crédito disponible", "Vista previa de IGV e impresión del documento"]],
    ["op", "buy", "Compras", "Órdenes, recepción parcial o total, abonos y devoluciones.", ["Compra directa o desde la sugerencia de reposición", "Borrador → orden de compra → recepción", "Recepciones parciales con saldo pendiente visible", "Abonos al proveedor y saldo por pagar", "Devolución al proveedor y reembolso", "Registro del documento del proveedor"]],
    ["op", "box", "Inventario", "Existencias por almacén, kardex, lotes, series, conteos y traslados.", ["Saldo recalculado con cada movimiento", "Lotes con fecha de vencimiento y alertas a 30 días", "Números de serie por unidad", "Conteo físico y carga de conteo desde Excel", "Traslados entre almacenes y solicitudes masivas con aprobación", "Mínimos por producto y ubicación"]],
    ["op", "tag", "Productos y categorías", "Catálogo con precios, unidades, marcas y trazabilidad.", ["Hasta 10,000 productos por archivo de importación", "Categorías, marcas, unidades y referencias", "Precio y costo configurables", "Existencias de apertura valorizadas", "Exportación a Excel"]],
    ["op", "user", "Clientes", "Directorio comercial con RUC y DNI autocompletados.", ["Autocompletar razón social y dirección desde RUC o DNI", "Contactos, estado y búsqueda", "Importación y exportación Excel", "Historial de ventas y cobros por cliente"]],
    ["op", "truck", "Proveedores", "Fichas, historial de compras y obligaciones.", ["Ficha con documento y contactos", "Historial de compras, recepciones y abonos", "Saldo por pagar por proveedor", "Importación y exportación"]],
    ["fin", "cash", "Caja", "Turnos por almacén, ingresos, retiros, arqueo y cierre.", ["Apertura con fondo inicial", "Cobros y pagos en efectivo vinculados al turno", "Ingresos y retiros manuales con motivo", "Conteo físico al cierre y diferencia registrada", "Historial de turnos con desglose"]],
    ["fin", "bank", "Bancos y conciliación", "Extractos, conciliación, cargos, comisiones y tarjetas.", ["Importación de extracto bancario (CSV)", "Vinculación de movimientos con pagos y depósitos", "Comisiones y retenciones registradas como gasto", "Liquidaciones de tarjeta con su propio flujo"]],
    ["fin", "book", "Contabilidad", "Plan de cuentas, asientos de doble partida y bloqueo mensual.", ["Asientos automáticos desde ventas, compras, pagos e inventario", "Asientos manuales balanceados e inmutables", "Cuentas por medio de pago y por almacén", "Saldos de apertura", "Bloqueo mensual por empresa", "Balance y reportes financieros preliminares"]],
    ["fin", "chart", "Panel y reportes", "Indicadores, cobranza, reposición y vistas guardadas.", ["Panel ejecutivo por período", "Embudo comercial y medios de pago", "Antigüedad de la cobranza y obligaciones", "Reposición con preparación de compra", "Filtros, vistas guardadas y exportación CSV / Excel"]],
    ["fin", "tax", "Tributación Perú", "Régimen de la empresa, IGV / IVAP y vista previa fiscal.", ["Perfil tributario por empresa", "Afectación IGV por producto", "Vista previa de IGV en ventas y compras", "Facturación electrónica SUNAT en certificación"]],
    ["gov", "build", "Empresas", "Varias empresas en una cuenta, con datos aislados.", ["Alta y edición de empresas", "Aislamiento de información por empresa", "Almacenes y cajas por empresa"]],
    ["gov", "key", "Usuarios", "Cuentas personales, sin credenciales compartidas.", ["Usuarios por empresa", "Contraseñas robustas con cierre de sesiones al cambiarlas", "Acceso por área de trabajo"]],
    ["gov", "shield", "Roles y permisos", "Lectura y operación por módulo, validadas en el servidor.", ["Roles a medida", "Permisos de lectura y operación por módulo", "El servidor rechaza lo que el rol no permite"]],
    ["gov", "log", "Bitácora", "Quién hizo qué, cuándo y con qué resultado.", ["Registro de inicios de sesión y operaciones", "Búsqueda por usuario, acción, módulo o registro", "No guarda contraseñas ni contenido de formularios"]],
    ["data", "swap", "Migración e intercambio", "Importa desde Excel u otro ERP; exporta cuando quieras.", ["Carga conjunta de clientes, proveedores, productos e inventario", "Asignación de columnas, validación y confirmación", "Exportación completa en JSON, CSV o Excel", "Usuarios exportados sin credenciales"]],
    ["data", "lock", "Respaldos", "Copias cifradas y restauración verificada.", ["Respaldo cifrado de la base", "Restauración comprobada en bases de prueba", "Comparación de datos tras restaurar"]],
    ["data", "spark", "Asistente", "Guías paso a paso dentro de cada pantalla.", ["Botón Ayuda en todo el sistema", "Guías de ventas, compras, inventario, caja, contabilidad y reportes", "Respuestas respetando los permisos del usuario", "Consultas de cifras con IA en desarrollo"]],
  ];
  $("#modGrid").innerHTML = MODS.map(([g, ic, t, d], i) => `<button class="mod" data-g="${g}" data-i="${i}"><span class="mod__top"><span class="mod__ic"><svg viewBox="0 0 24 24">${IC[ic]}</svg></span><span class="mod__g">${G[g]}</span></span><h3>${t}</h3><p>${d}</p><span class="mod__more">Ver funciones</span></button>`).join("") + `<a class="mod mod--cta js-wa2" href="https://wa.me/${WA}?text=${encodeURIComponent("Hola, quiero ver si DACONIX OS se adapta a mi operación.")}" target="_blank" rel="noopener"><span class="mod__g">Tu operación</span><h3>¿Tu empresa trabaja distinto?</h3><p>Cuéntanos cómo vendes, compras y almacenas. Te mostramos cómo se ve en DACONIX antes de decidir.</p><span class="mod__more">Conversar con el equipo</span></a>`;
  $$("#modFilters button").forEach((b) => b.addEventListener("click", () => { $$("#modFilters button").forEach((x) => x.setAttribute("aria-selected", String(x === b))); $$(".mod").forEach((m) => m.classList.toggle("is-dim", b.dataset.g !== "all" && m.dataset.g !== b.dataset.g)); }));
  const dr = $("#modDrawer");
  $("#modGrid").addEventListener("click", (e) => { const m = e.target.closest(".mod"); if (!m) return; const [g, , t, d, list] = MODS[+m.dataset.i]; $("#drawerGroup").textContent = G[g]; $("#drawerTitle").textContent = t; $("#drawerLead").textContent = d; $("#drawerList").innerHTML = list.map((x) => `<li>${x}</li>`).join(""); dr.showModal(); });
  $("#drawerX").addEventListener("click", () => dr.close());
  dr.addEventListener("click", (e) => { if (e.target === dr) dr.close(); });

  /* =========================================================
     ROLES · BITÁCORA · BLOQUEO MENSUAL
     ========================================================= */
  const AREAS = ["Ventas", "Clientes", "Compras", "Proveedores", "Inventario", "Productos", "Caja", "Bancos", "Contabilidad", "Reportes", "Usuarios y roles", "Bitácora"];
  const ROLES = {
    Gerencia: ["GE", "rrrrrrrrrrrr"], Ventas: ["VE", "oorrrrorrrnn"], Almacén: ["AL", "nnrrooonnnnn"], Compras: ["CO", "nnooorrnnrnn"], Contabilidad: ["CT", "rrrrrrroorrn"], Caja: ["CA", "rrnnnnoonnnn"], Administración: ["AD", "oooooooooooo"],
  };
  const PL = { o: ["p-op", "Opera"], r: ["p-rd", "Consulta"], n: ["p-no", "Sin acceso"] };
  $("#roles").innerHTML = Object.entries(ROLES).map(([k, [ab]], i) => `<button role="tab" aria-selected="${i === 1}" data-r="${k}"><i>${ab}</i>${k}</button>`).join("");
  const setRole = (k) => { $$("#roles button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.r === k))); const m = ROLES[k][1]; $("#perm").innerHTML = AREAS.map((a, i) => `<div class="${PL[m[i]][0]}">${a}<span>${PL[m[i]][1]}</span></div>`).join(""); };
  $("#roles").addEventListener("click", (e) => { const b = e.target.closest("button"); b && setRole(b.dataset.r); });
  setRole("Ventas");
  const AU = [["MQ", "M. Quispe", "Entregó venta V-002418", "Ventas"], ["RS", "R. Salazar", "Recibió OC-000317 · parcial 30/50", "Compras"], ["AH", "A. Huamán", "Cerró caja · Tienda Miraflores · cuadra", "Caja"], ["LP", "L. Paredes", "Bloqueó período octubre 2026", "Contabilidad"], ["MQ", "M. Quispe", "Registró cobro S/ 4,280.00", "Ventas"], ["JT", "J. Torres", "Aprobó traslado masivo · 14 productos", "Inventario"], ["LP", "L. Paredes", "Concilió extracto BCP · 38 movimientos", "Bancos"], ["AD", "Administrador", "Cambió permisos del rol Caja", "Roles"], ["RS", "R. Salazar", "Importó 1,240 productos · 12 por corregir", "Productos"]];
  const audit = $("#audit"); let ai = 0;
  const pushAudit = () => { const [av, u, a, m] = AU[ai++ % AU.length]; const li = document.createElement("li"); li.innerHTML = `<span class="av">${av}</span><div><b>${a}</b><small>${u} · ${m}</small></div><span class="t">${new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}</span>`; audit.prepend(li); while (audit.children.length > 7) audit.lastChild.remove(); };
  for (let i = 0; i < 6; i++) pushAudit();
  let auT; onView(audit, (v) => { clearInterval(auT); if (v && !RM) auT = setInterval(pushAudit, 2800); });
  const MN = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"], cm = new Date().getMonth();
  $("#months").innerHTML = MN.map((m, i) => `<button class="${i < cm - 1 ? "is-lock" : ""}" ${i > cm ? "disabled style='opacity:.35'" : ""}><b>${m}</b><small>${i < cm - 1 ? "Bloqueado" : "Abierto"}</small></button>`).join("");
  $("#months").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b || b.disabled) return; const l = b.classList.toggle("is-lock"); b.querySelector("small").textContent = l ? "Bloqueado" : "Abierto"; });

  /* =========================================================
     MIGRACIÓN
     ========================================================= */
  const ERRS = [["Fila 214", "Código PROD-0214 duplicado en el archivo"], ["Fila 1,087", "Precio vacío · se requiere un valor mayor a 0"], ["Fila 2,903", "Unidad \"Cjas\" no existe · ¿quisiste decir Caja?"], ["Fila 4,415", "Categoría \"Ferreteria\" sin tilde · se asignó Herramientas y Ferretería"], ["Fila 6,730", "Mínimo negativo (−5) · corregir antes de cargar"], ["Fila 7,812", "Código de barras con 12 dígitos · EAN-13 esperado"]];
  let migrBusy = false;
  function runMigr() {
    if (migrBusy) return; migrBusy = true; const btn = $("#migrRun"); btn.disabled = true; btn.textContent = "Validando…";
    const errs = $("#migrErrs"); errs.innerHTML = ""; let b = 0, bad = 0;
    const t = setInterval(() => {
      b++; $("#migrBlock").textContent = b; $("#migrFill").style.width = (b / 80) * 100 + "%";
      const e = ERRS.find((_, i) => Math.floor(((i + 1) * 80) / (ERRS.length + 1)) === b);
      if (e) { bad++; errs.insertAdjacentHTML("afterbegin", `<li><span class="num">${e[0]}</span><span>${e[1]}</span></li>`); while (errs.children.length > 4) errs.lastChild.remove(); }
      $("#migrOk").textContent = ni.format(b * 100 - bad); $("#migrBad").textContent = bad;
      if (b >= 80) { clearInterval(t); errs.insertAdjacentHTML("afterbegin", `<li class="ok"><span class="num">Listo</span><span>${ni.format(8000 - bad)} filas listas para confirmar. Corrige ${bad} y vuelve a cargarlas.</span></li>`); while (errs.children.length > 4) errs.lastChild.remove(); btn.disabled = false; btn.textContent = "Volver a simular"; migrBusy = false; }
    }, RM ? 1 : 45);
  }
  $("#migrRun").addEventListener("click", runMigr);
  once($("#migr"), runMigr, 0.5);

  /* =========================================================
     ASISTENTE (guías reales del ERP)
     ========================================================= */
  const GUIDES = [
    { q: "¿Cómo registro una venta y la cobro?", steps: ["Abre Ventas y selecciona Nueva cotización.", "Elige cliente, almacén y productos; revisa cantidades y precios antes de guardar.", "Confirma y entrega el pedido. La entrega registra la salida de existencias.", "En la venta entregada usa Registrar cobro y elige monto, medio de pago y caja."], note: "Las acciones dependen de tus permisos y del estado del documento.", go: "Ir a Ventas" },
    { q: "¿Cómo recibo una compra parcial?", steps: ["Abre Compras y ubica la orden en estado Por recibir.", "Pulsa Recibir e indica las cantidades que llegaron realmente.", "La compra queda como Recibida parcialmente y el saldo pendiente sigue visible.", "Cuando llegue el resto, vuelve a Recibir para completarla."], note: "Guardar un borrador no equivale a recibir mercadería.", go: "Ir a Compras" },
    { q: "¿Cómo cierro la caja?", steps: ["Abre Caja y elige el almacén del turno.", "Revisa el efectivo esperado: fondo, cobros, pagos, ingresos y retiros.", "Pulsa Cerrar caja e ingresa el conteo físico.", "Si hay diferencia, queda registrada con el usuario y la hora."], note: "Transferencias y tarjetas no forman parte del efectivo esperado.", go: "Ir a Caja" },
  ];
  const cb = $("#chatBody");
  cb.innerHTML = `<div class="msg msg--bot">Hola. Soy el asistente de DACONIX. Te guío paso a paso por cualquier pantalla del ERP.</div>`;
  $("#chatQ").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return; const g = GUIDES[+b.dataset.g]; $$("#chatQ button").forEach((x) => (x.disabled = true));
    cb.insertAdjacentHTML("beforeend", `<div class="msg msg--me">${g.q}</div><div class="msg msg--bot" id="typing"><span class="typing"><i></i><i></i><i></i></span></div>`); cb.scrollTop = cb.scrollHeight;
    setTimeout(() => { $("#typing").outerHTML = `<div class="msg msg--bot"><b>${g.q.replace(/[¿?]/g, "")}</b><ol>${g.steps.map((s) => `<li>${s}</li>`).join("")}</ol><span class="note">${g.note} · <u>${g.go} →</u></span></div>`; cb.scrollTop = cb.scrollHeight; b.remove(); $$("#chatQ button").forEach((x) => (x.disabled = false)); }, RM ? 10 : 900);
  });
})();

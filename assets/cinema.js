/* DACONIX OS — "Véalo operar": reproductor de recorridos animados sobre la interfaz del ERP.
   Cada capítulo es una línea de tiempo de pasos deterministas: se puede pausar, adelantar y saltar. */
(() => {
  "use strict";
  const { $, $$, S, Sk, nf, RM } = window.DX;
  const player = $("#player"), stage = $("#stage"), vp = $("#viewport"), capEl = $("#caption");
  let cursor = $("#cursor");
  const W = 1120, H = 700;

  /* ---------- Shell del ERP ---------- */
  const NAV = [["General", [["◫", "Panel general", "rep"]]], ["Operación", [["◉", "Clientes"], ["◇", "Proveedores"], ["▦", "Productos"], ["▤", "Inventario", "inv"], ["↙", "Compras", "buy", "3"], ["↗", "Ventas", "sale", "6"]]], ["Finanzas", [["▭", "Caja", "cash"], ["≡", "Contabilidad", "acc"], ["▲", "Reportes"]]], ["Gobierno", [["▣", "Empresas"], ["◎", "Usuarios"], ["◈", "Roles"], ["☰", "Bitácora"]]]];
  const shell = (on, body) => `<div class="erp"><aside class="erp__side"><div class="erp__logo"><i>✦</i>DACONIX OS</div>${NAV.map(([g, items]) => `<div class="erp__grp">${g}</div>` + items.map(([ic, t, k, b]) => `<div class="erp__nav ${k === on ? "on" : ""}"><span>${ic}</span>${t}${b ? `<em>${b}</em>` : ""}</div>`).join("")).join("")}</aside><div class="erp__main"><div class="erp__top"><div class="erp__search">⌕&nbsp; Buscar o ir a una pantalla</div><div class="erp__live"><i></i>En vivo</div><div class="erp__av">GE</div></div><div class="erp__body">${body}<div class="etoast" data-r="toast"><i>✓</i><span data-r="toastTxt"></span></div></div></div></div>`;
  const head = (crumb, title, desc, actions = "") => `<div class="erp__h"><div><div class="erp__crumb">${crumb}</div><h5>${title}</h5><p>${desc}</p></div><div style="display:flex;gap:8px">${actions}</div></div>`;
  const kpi = (t, v, dark, r) => `<div class="ekpi ${dark ? "ekpi--dark" : ""}"><small>${t}</small><b ${r ? `data-r="${r}"` : ""}>${v}</b></div>`;
  const modal = (r, title, inner) => `<div class="emodal" data-r="${r}"><div class="emodal__box"><h6>${title}</h6>${inner}</div></div>`;
  const today = new Date().toLocaleDateString("es-PE", { day: "numeric", month: "short" }).replace(".", "");

  /* ---------- Pasos ---------- */
  const mv = (at, r) => ({ at, run: (c) => c.move(r) });
  const ck = (at, r, fn) => ({ at, run: (c) => { c.click(r); fn && fn(c); } });
  const cap = (at, html) => ({ at, cap: html });

  /* =========================== CAPÍTULOS =========================== */
  const SCENES = [];

  /* 1 · VENTAS */
  SCENES.push({
    t: "Vender y cobrar", s: "Cotización → entrega → cobro", url: "ventas", dur: 15000,
    html: () => shell("sale",
      head("Operaciones", "Ventas", "Cotizaciones, pedidos y entregas con existencias controladas.", `<span class="ebtn ebtn--p" data-r="new">＋ Nueva cotización</span>`) +
      `<div class="ekpis">${kpi("Ventas entregadas · 30 días", "S/ 248,930.40", 1, "kSales")}${kpi("Cotizaciones abiertas", "18")}${kpi("Pedidos por entregar", "6", 0, "kPend")}${kpi("Saldo por cobrar", "S/ 52,520.40")}</div>
      <div class="ecard"><div class="ecard__h">Historial de ventas <span class="est">Todas</span></div><table class="etable"><thead><tr><th>Venta</th><th>Fecha</th><th>Cliente</th><th>Almacén</th><th class="r">Total</th><th>Estado</th><th>Acción</th></tr></thead><tbody data-r="tb">
      <tr><td>V-002417</td><td>${today}</td><td>Grupo Mistral SAC</td><td>Sucursal Trujillo</td><td class="r">S/ 4,280.00</td><td><span class="est est--ok">Cobrada</span></td><td><span class="ebtn">Imprimir</span></td></tr>
      <tr><td>V-002416</td><td>${today}</td><td>Ferretería El Sol SRL</td><td>Almacén Central</td><td class="r">S/ 2,754.00</td><td><span class="est est--ok">Entregada</span></td><td><span class="ebtn">Registrar cobro</span></td></tr>
      <tr><td>V-002415</td><td>ayer</td><td>Agroexport Ica SAC</td><td>Almacén Central</td><td class="r">S/ 18,900.00</td><td><span class="est est--vi">Pedido</span></td><td><span class="ebtn">Entregar</span></td></tr>
      <tr><td>V-002414</td><td>ayer</td><td>Inversiones Rímac EIRL</td><td>Tienda Miraflores</td><td class="r">S/ 2,940.50</td><td><span class="est est--ok">Cobrada</span></td><td><span class="ebtn">Imprimir</span></td></tr>
      <tr><td>V-002413</td><td>ayer</td><td>Textiles San Isidro SA</td><td>Almacén Central</td><td class="r">S/ 7,120.00</td><td><span class="est">Cotización</span></td><td><span class="ebtn">Confirmar</span></td></tr>
      </tbody></table></div>` +
      modal("m1", "Nueva cotización", `<div class="efield"><label>Cliente · RUC o DNI</label><div class="einput" data-r="ruc"></div><span class="echip" data-r="chip">✓ COMERCIAL ANDINA S.A.C. · Activo · Habido · Av. Argentina 2450, Lima</span></div>
        <div class="erow"><div class="efield"><label>Almacén</label><div class="einput">Almacén Central · Lima</div></div><div class="efield"><label>Condición</label><div class="einput">Transferencia</div></div></div>
        <div class="elines"><table class="etable"><thead><tr><th>Producto</th><th class="r">Cant.</th><th class="r">P. unit.</th><th class="r">Importe</th></tr></thead><tbody><tr data-r="line"><td style="color:#9692B3">Agrega un producto…</td><td></td><td></td><td></td></tr></tbody></table></div>
        <div class="etot"><span>Valor de venta</span><b data-r="tB">S/ 0.00</b><span>IGV 18 %</span><b data-r="tI">S/ 0.00</b><span class="big">Total</span><b class="big" data-r="tT">S/ 0.00</b></div>
        <div class="emodal__f"><span class="ebtn">Cancelar</span><span class="ebtn ebtn--p" data-r="save">Guardar cotización</span></div>`)),
    steps: [
      cap(0, "Toda venta empieza como <b>cotización</b>. No reserva stock hasta que se confirma."),
      mv(700, "new"), ck(1600, "new", (c) => c.on("m1")),
      { at: 2200, run: (c) => c.type("ruc", "20512345671", 800) },
      { at: 3200, cap: "Escribes el RUC y DACONIX completa <b>razón social, estado y dirección</b>.", run: (c) => c.on("chip") },
      { at: 4400, cap: "Precios con <b>IGV desglosado al centavo</b>.", run: (c) => { c.html("line", `<td>Laptop ThinkPad E14 <small style="color:#8B88A6">PROD-00412</small></td><td class="r">4</td><td class="r">3,250.00</td><td class="r">13,000.00</td>`); c.count("tB", 0, 11016.95, S); c.count("tI", 0, 1983.05, S); c.count("tT", 0, 13000, S); } },
      mv(6000, "save"), ck(6900, "save", (c) => { c.off("m1"); c.prepend("tb", `<tr class="is-new"><td><b>V-002418</b></td><td>${today}</td><td>Comercial Andina SAC</td><td>Almacén Central</td><td class="r">S/ 13,000.00</td><td><span class="est" data-r="st">Cotización</span></td><td><span class="ebtn ebtn--p" data-r="act">Confirmar</span></td></tr>`); }),
      { at: 7600, cap: "Al confirmar, el sistema <b>valida existencias</b> en el almacén elegido.", run: (c) => c.move("act") },
      ck(8500, "act", (c) => { c.state("st", "Pedido", "vi"); c.text("act", "Entregar"); }),
      ck(9800, "act", (c) => { c.state("st", "Entregada", "ok"); c.text("act", "Registrar cobro"); c.toast("Salida registrada · −4 und · Almacén Central"); }),
      cap(9900, "La entrega <b>descuenta el stock</b> y deja el movimiento en el kardex."),
      ck(11600, "act", (c) => { c.state("st", "Cobrada", "ok"); c.text("act", "Imprimir"); c.cls("act", "ebtn--p", false); c.toast("Cobro S/ 13,000.00 · Asiento AS-01182 generado · Debe = Haber"); c.count("kSales", 248930.4, 261930.4, S); }),
      cap(11700, "Cobro, caja y asiento contable con un clic. <b>Nadie vuelve a digitar nada.</b>"),
    ],
  });

  /* 2 · COMPRAS */
  SCENES.push({
    t: "Comprar y recibir", s: "Recepción parcial y abonos", url: "compras", dur: 14500,
    html: () => shell("buy",
      head("Operaciones", "Compras", "Solicitudes, órdenes de compra y recepción total o parcial.", `<span class="ebtn">Preparar desde reposición</span><span class="ebtn ebtn--p">＋ Compra directa</span>`) +
      `<div class="ekpis">${kpi("Compras recibidas · 30 días", "S/ 131,204.75", 1)}${kpi("Borradores", "2")}${kpi("Por recibir", "3", 0, "kRcv")}${kpi("Saldo por pagar", "S/ 38,912.00", 0, "kAp")}</div>
      <div class="ecard"><div class="ecard__h">Historial de compras <span class="est">Este mes</span></div><table class="etable etable--tight"><thead><tr><th>Compra</th><th>Proveedor</th><th class="r">Total</th><th class="r">Saldo</th><th>Recepción</th><th>Estado</th><th>Acción</th></tr></thead><tbody>
      <tr class="is-new"><td><b>OC-000317</b></td><td>Tecnología Global SAC</td><td class="r">S/ 18,450.00</td><td class="r" data-r="bal">S/ 18,450.00</td><td><span class="eprog"><i data-r="prog" style="width:0%"></i></span> <small data-r="progT">0/70</small></td><td><span class="est est--vi" data-r="st">Orden de compra</span></td><td style="display:flex;gap:6px"><span class="ebtn ebtn--p" data-r="rcv">Recibir</span><span class="ebtn" data-r="pay">Abonar</span></td></tr>
      <tr><td>OC-000316</td><td>Importaciones Norte SAC</td><td class="r">S/ 6,240.00</td><td class="r">S/ 0.00</td><td><span class="eprog"><i style="width:100%"></i></span> <small>40/40</small></td><td><span class="est est--ok">Recibida completa</span></td><td><span class="ebtn">Ver pagos</span></td></tr>
      <tr><td>OC-000315</td><td>Aceros del Sur SA</td><td class="r">S/ 12,980.00</td><td class="r">S/ 7,980.00</td><td><span class="eprog"><i style="width:100%"></i></span> <small>120/120</small></td><td><span class="est est--ok">Recibida completa</span></td><td><span class="ebtn">Abonar</span></td></tr>
      <tr><td>OC-000314</td><td>Tecnología Global SAC</td><td class="r">S/ 3,410.00</td><td class="r">—</td><td><span class="eprog"><i style="width:0"></i></span> <small>0/25</small></td><td><span class="est">Borrador de orden</span></td><td><span class="ebtn">Confirmar OC</span></td></tr>
      </tbody></table></div>` +
      modal("m1", "Recibir OC-000317 · Almacén Central", `<div class="elines"><table class="etable"><thead><tr><th>Producto</th><th class="r">Pedido</th><th class="r">Recibido antes</th><th class="r">Recibe ahora</th></tr></thead><tbody>
        <tr><td>Switch PoE 24 puertos</td><td class="r">50</td><td class="r">0</td><td class="r" style="width:130px"><div class="einput" data-r="q1" style="justify-content:flex-end"></div></td></tr>
        <tr><td>Monitor 27" QHD</td><td class="r">20</td><td class="r">0</td><td class="r"><div class="einput" data-r="q2" style="justify-content:flex-end"></div></td></tr></tbody></table></div>
        <p style="font-size:11.5px;color:#6E6B8A;margin:0 0 12px">Solo lo recibido entra al stock. El resto queda pendiente en la orden.</p>
        <div class="emodal__f"><span class="ebtn">Cancelar</span><span class="ebtn ebtn--p" data-r="ok1">Registrar recepción</span></div>`) +
      modal("m2", "Abono al proveedor · OC-000317", `<div class="erow"><div class="efield"><label>Saldo pendiente</label><div class="einput">S/ 18,450.00</div></div><div class="efield"><label>Medio de pago</label><div class="einput">Transferencia · Cuenta corriente</div></div></div>
        <div class="efield"><label>Monto del abono</label><div class="einput" data-r="amt"></div></div>
        <div class="emodal__f"><span class="ebtn">Cancelar</span><span class="ebtn ebtn--p" data-r="ok2">Registrar abono</span></div>`)),
    steps: [
      cap(0, "Las compras pasan por <b>borrador, orden y recepción</b>. Cada paso queda registrado."),
      mv(700, "rcv"), ck(1600, "rcv", (c) => c.on("m1")),
      { at: 2300, run: (c) => c.type("q1", "50", 350) }, { at: 3000, run: (c) => c.type("q2", "0", 250) },
      cap(2400, "Llegó solo una parte: registras <b>lo que realmente ingresó</b>."),
      mv(4000, "ok1"), ck(4900, "ok1", (c) => { c.off("m1"); c.state("st", "Recibida parcialmente", "warn"); c.width("prog", 71); c.text("progT", "50/70"); c.text("rcv", "Recibir saldo"); c.toast("Entrada +50 und · Switch PoE 24 puertos · Almacén Central"); }),
      cap(5000, "El saldo pendiente queda visible. <b>El stock sube solo con lo recibido.</b>"),
      mv(6800, "pay"), ck(7700, "pay", (c) => c.on("m2")),
      { at: 8300, run: (c) => c.type("amt", "S/ 10,000.00", 700) },
      mv(9300, "ok2"), ck(10200, "ok2", (c) => { c.off("m2"); c.text("paid", "S/ 10,000.00"); c.count("bal", 18450, 8450, S); c.count("kAp", 38912, 28912, S); c.toast("Abono registrado · Asiento AS-01183 · Cuentas por pagar −S/ 10,000.00"); }),
      cap(10300, "Los abonos bajan la <b>cuenta por pagar</b> y escriben su propio asiento."),
      mv(11600, "rcv"), ck(12500, "rcv", (c) => { c.state("st", "Recibida completa", "ok"); c.width("prog", 100); c.text("progT", "70/70"); c.text("rcv", "Ver pagos"); c.cls("rcv", "ebtn--p", false); c.text("kRcv", "2"); c.toast("Entrada +20 und · Monitor 27\" QHD · orden completa"); }),
      cap(12600, "Cuando llega el resto, la orden <b>se completa</b> y sale de pendientes."),
    ],
  });

  /* 3 · INVENTARIO */
  const stockRows = `<tr><td>Laptop ThinkPad E14</td><td>Almacén Central</td><td class="r">42</td><td class="r">15</td><td><span class="est est--ok">Disponible</span></td></tr>
    <tr><td>Impresora térmica 80 mm</td><td>Tienda Miraflores</td><td class="r" data-r="imp">3</td><td class="r">12</td><td><span class="est est--bad" data-r="impSt">Bajo el mínimo</span></td></tr>
    <tr><td>Switch PoE 24 puertos</td><td>Sucursal Trujillo</td><td class="r">2</td><td class="r">8</td><td><span class="est est--bad">Bajo el mínimo</span></td></tr>
    <tr><td>Router Wi-Fi 6 AX3000</td><td>Almacén Central</td><td class="r">118</td><td class="r">40</td><td><span class="est est--ok">Disponible</span></td></tr>
    <tr><td>Tóner HP 85A</td><td>Almacén Central</td><td class="r">64</td><td class="r">20</td><td><span class="est est--ok">Disponible</span></td></tr>`;
  SCENES.push({
    t: "Inventario multi-almacén", s: "Traslados, lotes y series", url: "inventario", dur: 14000,
    html: () => shell("inv",
      head("Operaciones", "Inventario", "Existencias por almacén y el historial de cada movimiento.", `<span class="ebtn">Registrar movimiento</span><span class="ebtn ebtn--p" data-r="tr">⇄ Transferir almacén</span><span class="ebtn">Conteo físico</span>`) +
      `<div class="ewh"><div class="ewhc" data-r="w0"><small>Almacén Central · Lima</small><b data-r="v0">S/ 346,548.06</b><div class="ebar"><i data-r="b0" style="width:72%"></i></div></div><div class="ewhc"><small>Sucursal Norte · Trujillo</small><b>S/ 161,324.10</b><div class="ebar"><i style="width:48%"></i></div></div><div class="ewhc" data-r="w2"><small>Tienda Miraflores</small><b data-r="v2">S/ 89,624.49</b><div class="ebar"><i class="warn" data-r="b2" style="width:31%"></i></div></div></div>
      <div class="ecard"><div class="ecard__h"><span style="display:flex;gap:6px"><span class="ebtn ebtn--p" data-r="t0">Existencias</span><span class="ebtn" data-r="t1">Lotes y vencimientos</span><span class="ebtn" data-r="t2">Números de serie</span></span><span class="est">25 por página</span></div><table class="etable"><thead data-r="th"><tr><th>Producto</th><th>Almacén</th><th class="r">Disponible</th><th class="r">Mínimo</th><th>Estado</th></tr></thead><tbody data-r="tb">${stockRows}</tbody></table></div>` +
      modal("m1", "Transferir entre almacenes", `<div class="erow"><div class="efield"><label>Origen</label><div class="einput">Almacén Central · Lima</div></div><div class="efield"><label>Destino</label><div class="einput">Tienda Miraflores</div></div></div>
        <div class="erow"><div class="efield"><label>Producto</label><div class="einput">Impresora térmica 80 mm · disp. 96</div></div><div class="efield"><label>Cantidad</label><div class="einput" data-r="q"></div></div></div>
        <p style="font-size:11.5px;color:#6E6B8A;margin:2px 0 12px">Salida y entrada se registran juntas. Si ambos almacenes tienen cuenta contable, el valor se reclasifica.</p>
        <div class="emodal__f"><span class="ebtn">Cancelar</span><span class="ebtn ebtn--p" data-r="ok">Transferir</span></div>`)),
    steps: [
      cap(0, "Existencias <b>en vivo por almacén</b>, con mínimos por producto y ubicación."),
      { at: 900, cap: "Tienda Miraflores está <b>por debajo del mínimo</b>. Hay que reponer.", run: (c) => c.cls("w2", "on", true) },
      mv(2000, "tr"), ck(2900, "tr", (c) => c.on("m1")),
      { at: 3600, run: (c) => c.type("q", "24", 400) },
      mv(4600, "ok"), ck(5500, "ok", (c) => { c.off("m1"); c.cls("w2", "on", false); c.width("b0", 69); c.width("b2", 44); c.count("v0", 346548.06, 336501.66, S); c.count("v2", 89624.49, 99670.89, S); c.text("imp", "27"); c.state("impSt", "Disponible", "ok"); c.toast("Traslado TR-000094 · 24 und · reclasificación contable registrada"); }),
      cap(5600, "El traslado mueve unidades y <b>valor contable</b> en una sola transacción."),
      mv(7600, "t1"), ck(8500, "t1", (c) => { c.cls("t0", "ebtn--p", false); c.cls("t1", "ebtn--p", true); c.html("th", `<tr><th>Lote</th><th>Producto</th><th>Vence</th><th class="r">Disponible</th><th>Estado</th></tr>`); c.html("tb", `<tr class="is-new"><td>L-2611</td><td>Tóner HP 85A</td><td>05 dic 2026</td><td class="r">40</td><td><span class="est est--warn">Vence en 12 días</span></td></tr><tr class="is-new"><td>L-2598</td><td>Pasta térmica 4 g</td><td>18 nov 2026</td><td class="r">6</td><td><span class="est est--bad">Vencido</span></td></tr><tr class="is-new"><td>L-2640</td><td>Tóner HP 85A</td><td>14 mar 2027</td><td class="r">24</td><td><span class="est est--ok">Vigente</span></td></tr><tr class="is-new"><td>L-2655</td><td>Batería UPS 12 V</td><td>30 jun 2027</td><td class="r">58</td><td><span class="est est--ok">Vigente</span></td></tr>`); }),
      cap(8600, "Lotes con fecha de vencimiento y <b>alertas a 30 días</b>."),
      mv(10600, "t2"), ck(11500, "t2", (c) => { c.cls("t1", "ebtn--p", false); c.cls("t2", "ebtn--p", true); c.html("th", `<tr><th>Serie</th><th>Producto</th><th>Almacén</th><th>Documento</th><th>Estado</th></tr>`); c.html("tb", `<tr class="is-new"><td>PF4KQ7X2</td><td>Laptop ThinkPad E14</td><td>Almacén Central</td><td>V-002418</td><td><span class="est est--vi">Vendida</span></td></tr><tr class="is-new"><td>PF4KQ7X9</td><td>Laptop ThinkPad E14</td><td>Almacén Central</td><td>OC-000301</td><td><span class="est est--ok">Disponible</span></td></tr><tr class="is-new"><td>PF4KQ8A1</td><td>Laptop ThinkPad E14</td><td>Almacén Central</td><td>OC-000301</td><td><span class="est est--ok">Disponible</span></td></tr><tr class="is-new"><td>SW24-00871</td><td>Switch PoE 24 puertos</td><td>Sucursal Trujillo</td><td>OC-000317</td><td><span class="est est--ok">Disponible</span></td></tr>`); }),
      cap(11600, "Cada número de serie sabe <b>en qué compra entró y en qué venta salió</b>."),
    ],
  });

  /* 4 · CAJA */
  SCENES.push({
    t: "Caja que cuadra", s: "Turno, arqueo y cierre", url: "caja", dur: 13000,
    html: () => shell("cash",
      head("Operación diaria", "Caja", "Fondos, cobros, pagos, retiros, ingresos y cierres por almacén.", `<span class="ebtn">Conciliación bancaria</span><span class="ebtn">＋ Ingreso o retiro</span><span class="ebtn ebtn--p" data-r="close">Cerrar caja</span>`) +
      `<div class="ecash"><div class="ecash__hero" style="position:relative"><small>Efectivo esperado en caja · Tienda Miraflores</small><b data-r="exp">S/ 500.00</b><div class="ecash__rows"><div>Fondo inicial<b>S/ 500.00</b></div><div>Cobros de ventas<b data-r="cob">S/ 0.00</b></div><div>Pagos a proveedores<b>S/ 0.00</b></div><div>Retiros manuales<b data-r="ret">S/ 0.00</b></div><div>Conteo físico al cierre<b data-r="cnt">Pendiente</b></div></div><div class="estamp" data-r="stamp" style="right:22px;top:24px">CUADRA</div></div>
      <div class="ecard"><div class="ecard__h">Movimientos del turno <span class="est est--ok">Turno abierto · 08:00</span></div><table class="etable"><thead><tr><th>Hora</th><th>Tipo</th><th>Referencia</th><th class="r">Monto</th></tr></thead><tbody data-r="tb"><tr><td>08:00</td><td>Apertura</td><td>Fondo inicial</td><td class="r">S/ 500.00</td></tr></tbody></table></div></div>` +
      modal("m1", "Cerrar caja · Tienda Miraflores", `<div class="erow"><div class="efield"><label>Efectivo esperado</label><div class="einput">S/ 4,812.50</div></div><div class="efield"><label>Conteo físico</label><div class="einput" data-r="cnt2"></div></div></div>
        <div class="efield"><label>Diferencia</label><div class="einput" data-r="diff" style="font-family:var(--mono)">—</div></div>
        <div class="emodal__f"><span class="ebtn">Cancelar</span><span class="ebtn ebtn--p" data-r="ok">Cerrar turno</span></div>`)),
    steps: (() => {
      const mvs = [["09:14", "Cobro", "V-002411 · Efectivo", 1280], ["10:02", "Cobro", "V-002414 · Efectivo", 2940.5], ["11:30", "Retiro", "Compra de útiles", -120], ["12:45", "Cobro", "V-002419 · Efectivo", 212]];
      let cob = 0, ret = 0, exp = 500;
      const out = [cap(0, "El turno abre con su fondo. <b>Cada cobro en efectivo entra solo</b> a la caja.")];
      mvs.forEach(([h, t, r, a], i) => {
        const pc = cob, pr = ret, pe = exp; if (a > 0) cob += a; else ret += -a; exp += a; const nc = cob, nr = ret, ne = exp;
        out.push({ at: 700 + i * 1000, run: (c) => { c.prepend("tb", `<tr class="is-new"><td>${h}</td><td>${t}</td><td>${r}</td><td class="r" style="color:${a < 0 ? "#B2352C" : "inherit"}">${a < 0 ? "− " : ""}${S(Math.abs(a))}</td></tr>`); if (a > 0) c.count("cob", pc, nc, S, 500); else c.count("ret", pr, nr, S, 500); c.count("exp", pe, ne, S, 500); } });
      });
      return out.concat([
        cap(4900, "Al cierre, el cajero cuenta el efectivo y <b>el sistema compara</b>."),
        mv(5000, "close"), ck(5900, "close", (c) => c.on("m1")),
        { at: 6600, run: (c) => c.type("cnt2", "S/ 4,812.50", 800) },
        { at: 7600, run: (c) => { c.html("diff", `<span style="color:#0F7A57;font-weight:600">S/ 0.00 · sin diferencia</span>`); } },
        mv(8000, "ok"), ck(8900, "ok", (c) => { c.off("m1"); c.text("cnt", "S/ 4,812.50"); c.on("stamp"); c.toast("Turno cerrado · Tienda Miraflores · cuadra al centavo"); }),
        cap(9000, "<b>Cuadra.</b> Y si no cuadrara, la diferencia queda registrada con usuario y hora."),
        cap(11200, "Transferencias y tarjetas se <b>concilian aparte</b> contra el extracto del banco."),
      ]);
    })(),
  });

  /* 5 · CONTABILIDAD */
  const AS = [["AS-01182", "Venta V-002418", [["1041", "Cuentas corrientes", 13000, 0], ["4011", "IGV · cuenta propia", 0, 1983.05], ["7011", "Venta de mercaderías", 0, 11016.95]]], ["AS-01183", "Abono OC-000317", [["4212", "Facturas por pagar", 10000, 0], ["1041", "Cuentas corrientes", 0, 10000]]], ["AS-01184", "Costo de venta V-002418", [["6911", "Costo de ventas", 9640, 0], ["2011", "Mercaderías", 0, 9640]]]];
  SCENES.push({
    t: "Contabilidad automática", s: "Asientos y bloqueo mensual", url: "contabilidad", dur: 12500,
    html: () => shell("acc",
      head("Finanzas · Libro mayor", "Contabilidad", "Plan de cuentas y asientos de doble partida. Los asientos son inmutables.", `<span class="ebtn">Saldos de apertura</span><span class="ebtn">＋ Asiento manual</span>`) +
      `<div class="ekpis">${kpi("Débitos registrados", "S/ 1,284,610.20", 1, "kD")}${kpi("Créditos registrados", "S/ 1,284,610.20", 0, "kH")}${kpi("Estado", "Debe = Haber")}${kpi("Asientos del mes", "1,181", 0, "kN")}</div>
      <div class="ecard" style="margin-bottom:12px"><div class="ecard__h">Asientos registrados <span class="est est--ok">Balanceados</span></div><table class="etable etable--tight"><thead><tr><th>Asiento</th><th>Origen</th><th>Cuenta</th><th class="r">Debe</th><th class="r">Haber</th></tr></thead><tbody data-r="tb"></tbody></table></div>
      <div class="ecard" style="padding:12px 14px"><div style="display:flex;justify-content:space-between;margin-bottom:8px;font-weight:650">Bloqueo mensual · 2026 <span class="est">Impide nuevos asientos con fecha en el mes</span></div><div class="emonths">${["Jul", "Ago", "Set", "Oct", "Nov", "Dic"].map((m, i) => `<div class="emonth ${i < 3 ? "lock" : ""}" ${i === 3 ? 'data-r="oct"' : ""}>${m}<small data-r="${i === 3 ? "octS" : ""}">${i < 3 ? "Bloqueado" : "Abierto"}</small></div>`).join("")}</div></div>`),
    steps: (() => {
      let d = 1284610.2, n = 1181; const out = [cap(0, "Cada operación escribe su <b>asiento de doble partida</b>. Nadie lo digita.")];
      AS.forEach(([id, src, lines], i) => {
        const tot = lines.reduce((a, l) => a + l[2], 0), pd = d, pn = n; d += tot; n++; const nd = d, nn = n;
        out.push({ at: 600 + i * 1300, run: (c) => { c.append("tb", lines.map((l, j) => `<tr class="is-new">${j ? "<td></td><td></td>" : `<td><b>${id}</b></td><td>${src}</td>`}<td><span style="font-family:var(--mono);color:#4B3DD8;margin-right:6px">${l[0]}</span>${l[1]}</td><td class="r">${l[2] ? nf.format(l[2]) : ""}</td><td class="r">${l[3] ? nf.format(l[3]) : ""}</td></tr>`).join("")); c.count("kD", pd, nd, S, 600); c.count("kH", pd, nd, S, 600); c.text("kN", nf.format(nn).replace(".00", "")); } });
      });
      return out.concat([
        cap(4300, "Los asientos son <b>inmutables</b>: se corrigen con otro asiento, nunca se editan."),
        cap(6200, "Cuando el contador revisa el mes, <b>lo bloquea</b>."),
        mv(6300, "oct"), ck(7200, "oct", (c) => { c.cls("oct", "lock", true); c.text("octS", "Bloqueado"); c.toast("Octubre 2026 bloqueado · no admite nuevos asientos"); }),
        cap(8600, "Cuentas por medio de pago y por almacén, según el <b>Plan Contable General Empresarial</b>."),
      ]);
    })(),
  });

  /* 6 · REPORTES */
  const pts = (arr) => arr.map((v, i) => `${(i / (arr.length - 1)) * 560},${150 - v}`).join(" ");
  const A30 = [40, 52, 48, 66, 60, 74, 70, 88, 80, 96, 92, 104, 118, 110], B30 = [30, 36, 40, 44, 52, 50, 58, 66, 62, 72, 76, 80, 90, 94];
  const A90 = [20, 34, 30, 48, 58, 54, 72, 80, 78, 98, 104, 116, 126, 138], B90 = [14, 24, 28, 36, 44, 46, 58, 64, 70, 80, 88, 96, 104, 116];
  SCENES.push({
    t: "Reportes de gerencia", s: "Panel, alertas y exportación", url: "panel", dur: 12500,
    html: () => shell("rep",
      `<div class="erp__h"><div><div class="erp__crumb">${new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}</div><h5>Hola, Gerencia</h5><p data-r="sum">Las ventas entregadas en 30 días suman S/ 248,930.40. El saldo por cobrar es S/ 52,520.40.</p></div><div style="display:flex;gap:2px;background:#ECEAF5;padding:3px;border-radius:10px"><span class="ebtn" style="border:0;background:none">7 días</span><span class="ebtn" data-r="p30" style="border:0">30 días</span><span class="ebtn" data-r="p90" style="border:0;background:none">90 días</span></div></div>
      <div class="ekpis">${kpi("Ventas entregadas", "S/ 0.00", 1, "k1")}${kpi("Cobros de ventas", "S/ 0.00", 0, "k2")}${kpi("Por cobrar", "S/ 0.00", 0, "k3")}${kpi("Inventario al costo", "S/ 0.00", 0, "k4")}</div>
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:12px;margin-bottom:12px"><div class="ecard" style="padding:12px 14px"><div style="display:flex;justify-content:space-between;font-weight:650;margin-bottom:8px">Ventas y cobros <span style="font-size:11px;color:#7D7A99;font-weight:500"><span style="color:#5B4CF0">━</span> Ventas &nbsp; <span style="color:#E2A93B">━</span> Cobrado</span></div><div class="echart"><svg viewBox="0 0 560 150" preserveAspectRatio="none"><g stroke="#F0EEF7">${[30, 70, 110, 150].map((y) => `<line x1="0" x2="560" y1="${y}" y2="${y}"/>`).join("")}</g><polyline class="ln" data-r="la" stroke="#5B4CF0" points="${pts(A30)}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.4s ease"/><polyline class="ln" data-r="lb" stroke="#E2A93B" points="${pts(B30)}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.4s ease .2s"/></svg></div></div>
      <div class="ecard" style="padding:12px 14px"><div style="font-weight:650;margin-bottom:8px">Dónde poner la atención</div><div style="display:grid;gap:7px;font-size:12px"><div class="ewhc" data-r="a1" style="padding:9px 11px"><b style="font-size:13px;margin:0">6 productos bajo el mínimo</b><small>en 3 ubicaciones · preparar compra</small></div><div class="ewhc" data-r="a2" style="padding:9px 11px"><b style="font-size:13px;margin:0">3 clientes con saldo vencido</b><small>S/ 18,240.00 con más de 30 días</small></div><div class="ewhc" data-r="a3" style="padding:9px 11px"><b style="font-size:13px;margin:0">2 compras por recibir</b><small>en Almacén Central</small></div></div></div></div>
      <div class="ecard"><div class="ecard__h">Reposición requerida <span style="display:flex;gap:6px"><span class="ebtn">Exportar CSV</span><span class="ebtn ebtn--ok" data-r="xls">Exportar Excel</span><span class="ebtn ebtn--p">Preparar compra</span></span></div><table class="etable"><thead><tr><th>Producto</th><th>Almacén</th><th class="r">Disponible</th><th class="r">Mínimo</th><th class="r">Sugerido</th></tr></thead><tbody><tr><td>Switch PoE 24 puertos</td><td>Sucursal Trujillo</td><td class="r">2</td><td class="r">8</td><td class="r">14</td></tr><tr><td>Monitor 27" QHD</td><td>Sucursal Trujillo</td><td class="r">0</td><td class="r">10</td><td class="r">20</td></tr></tbody></table></div>`),
    steps: [
      { at: 0, cap: "El panel de gerencia <b>se arma solo</b> con lo que el equipo registra.", run: (c) => { c.count("k1", 0, 248930.4, S, 1200); c.count("k2", 0, 196410, S, 1200); c.count("k3", 0, 52520.4, S, 1200); c.count("k4", 0, 597496.65, S, 1200); c.style("la", "strokeDashoffset", "0"); c.style("lb", "strokeDashoffset", "0"); } },
      cap(2400, "Cambia el período y <b>todo se recalcula</b>: ventas, cobros, cartera y stock."),
      mv(2500, "p90"), ck(3400, "p90", (c) => { c.style("p30", "background", "none"); c.style("p90", "background", "#fff"); c.html("sum", "Las ventas entregadas en 90 días suman S/ 731,204.90. El saldo por cobrar es S/ 52,520.40."); c.count("k1", 248930.4, 731204.9, S, 900); c.count("k2", 196410, 642118.35, S, 900); c.attr("la", "points", pts(A90)); c.attr("lb", "points", pts(B90)); }),
      { at: 5200, cap: "Alertas que importan: <b>stock bajo, cartera vencida, compras por recibir</b>.", run: (c) => c.cls("a1", "on", true) },
      { at: 6000, run: (c) => { c.cls("a1", "on", false); c.cls("a2", "on", true); } },
      { at: 6800, run: (c) => { c.cls("a2", "on", false); c.cls("a3", "on", true); } },
      { at: 7600, run: (c) => c.cls("a3", "on", false) },
      mv(7700, "xls"), ck(8600, "xls", (c) => c.toast("reposicion_requerida.xlsx · descargado")),
      cap(8700, "Exporta a <b>Excel o CSV</b> exactamente lo que estás viendo."),
      cap(10400, "<b>Una sola fuente de verdad</b> para cada sol de tu empresa."),
    ],
  });

  /* =========================== MOTOR =========================== */
  const total = SCENES.reduce((a, s) => a + s.dur, 0);
  let si = 0, t = 0, applied = 0, playing = false, userPaused = false, speed = 1, last = 0, gen = 0, scale = 1, inView = false;
  const timers = new Set();
  const q = (r) => stage.querySelector(`[data-r="${r}"]`);
  const later = (fn, ms) => { const g = gen; const id = setTimeout(() => { timers.delete(id); g === gen && fn(); }, ms); timers.add(id); };
  const ctx = {
    instant: false,
    move(r) { const el = q(r); if (!el) return; const sr = stage.getBoundingClientRect(), er = el.getBoundingClientRect(); const x = (er.left - sr.left + er.width * 0.55) / scale, y = (er.top - sr.top + er.height * 0.6) / scale; cursor.classList.toggle("no-t", this.instant); cursor.style.transform = `translate(${x}px,${y}px)`; },
    click(r) { const el = q(r); if (!el || this.instant) return; el.classList.add("is-press"); cursor.classList.remove("is-click"); void cursor.offsetWidth; cursor.classList.add("is-click"); later(() => el.classList.remove("is-press"), 220); },
    on(r) { q(r)?.classList.add("on"); }, off(r) { q(r)?.classList.remove("on"); },
    cls(r, c, v) { q(r)?.classList.toggle(c, v); },
    text(r, v) { const e = q(r); if (e) e.textContent = v; },
    html(r, v) { const e = q(r); if (e) e.innerHTML = v; },
    style(r, k, v) { const e = q(r); if (e) e.style[k] = v; },
    attr(r, k, v) { q(r)?.setAttribute(k, v); },
    width(r, v) { const e = q(r); if (e) e.style.width = v + "%"; },
    prepend(r, h) { q(r)?.insertAdjacentHTML("afterbegin", h); },
    append(r, h) { q(r)?.insertAdjacentHTML("beforeend", h); },
    state(r, label, kind) { const e = q(r); if (e) { e.className = "est" + (kind ? " est--" + kind : ""); e.textContent = label; } },
    type(r, txt, ms) { const e = q(r); if (!e) return; if (this.instant) { e.textContent = txt; return; } e.classList.add("is-focus"); let i = 0; const stepMs = ms / txt.length; const go = () => { i++; e.innerHTML = txt.slice(0, i) + '<span class="caret"></span>'; if (i < txt.length) later(go, stepMs); else later(() => { e.classList.remove("is-focus"); e.textContent = txt; }, 500); }; go(); },
    count(r, a, b, fmt = S, ms = 900) { const e = q(r); if (!e) return; if (this.instant || RM) { e.textContent = fmt(b); return; } const g = gen, t0 = performance.now(); const f = (now) => { if (g !== gen) return; const k = Math.max(0, Math.min(1, (now - t0) / ms)), v = a + (b - a) * (1 - Math.pow(1 - k, 3)); e.textContent = fmt(v); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); },
    toast(txt) { const e = q("toast"); if (!e) return; q("toastTxt").textContent = txt; e.classList.add("on"); if (!this.instant) later(() => e.classList.remove("on"), 2600); },
  };

  function build(i) {
    gen++; timers.forEach(clearTimeout); timers.clear();
    si = i; applied = 0;
    stage.innerHTML = SCENES[i].html();
    stage.append(cursor);
    $("#chromeUrl").textContent = "daconix-os.onrender.com/" + SCENES[i].url;
    $$(".chap").forEach((c, k) => c.classList.toggle("is-on", k === i));
    setCap("");
  }
  function setCap(html) { if (capEl._v === html) return; capEl._v = html; capEl.innerHTML = html ? `<span class="cap">${html}</span>` : ""; }
  function applyUntil(time, instant) {
    const steps = SCENES[si].steps; ctx.instant = instant;
    if (instant) stage.firstElementChild?.classList.add("no-anim");
    let lastCap = null;
    while (applied < steps.length && steps[applied].at <= time) { const s = steps[applied++]; s.run && s.run(ctx); if (s.cap != null) lastCap = s.cap; }
    if (lastCap != null) setCap(lastCap);
    if (instant) { const el = stage.firstElementChild; requestAnimationFrame(() => requestAnimationFrame(() => { el?.classList.remove("no-anim"); cursor.classList.remove("no-t"); })); }
    ctx.instant = false;
  }
  function seekGlobal(T) {
    T = Math.max(0, Math.min(total - 1, T)); let acc = 0, i = 0;
    while (i < SCENES.length - 1 && T >= acc + SCENES[i].dur) acc += SCENES[i++].dur;
    build(i); t = T - acc; cursor.classList.add("no-t"); cursor.style.transform = `translate(${W * 0.72}px,${H * 0.62}px)`;
    applyUntil(t, true); ui();
  }
  function startScene(i) { build(i); t = 0; cursor.style.transform = cursor.style.transform || `translate(${W * 0.72}px,${H * 0.62}px)`; applyUntil(0, false); }
  function frame(now) {
    if (!playing) return;
    const dt = Math.min(64, now - last); last = now; t += dt * speed;
    applyUntil(t, false);
    if (t >= SCENES[si].dur) startScene((si + 1) % SCENES.length);
    ui(); requestAnimationFrame(frame);
  }
  const fmtT = (ms) => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  function globalT() { let a = 0; for (let i = 0; i < si; i++) a += SCENES[i].dur; return a + t; }
  function ui() {
    const G = globalT(), pct = (G / total) * 100;
    $("#scrubFill").style.width = pct + "%"; $("#scrub").setAttribute("aria-valuenow", Math.round(pct));
    $("#timeLbl").textContent = fmtT(G) + " / " + fmtT(total);
    $$(".chap__p").forEach((p, k) => (p.style.width = k < si ? "100%" : k === si ? Math.min(100, (t / SCENES[si].dur) * 100) + "%" : "0"));
  }
  function play() { if (playing) return; playing = true; player.classList.remove("is-paused"); $("#playBtn").setAttribute("aria-label", "Pausar"); last = performance.now(); requestAnimationFrame(frame); }
  function pause() { playing = false; player.classList.add("is-paused"); $("#playBtn").setAttribute("aria-label", "Reproducir"); }

  /* ---------- UI ---------- */
  $("#chapters").innerHTML = SCENES.map((s, i) => `<button class="chap" data-i="${i}"><span class="chap__n">0${i + 1}</span><span><b>${s.t}</b><small>${s.s}</small></span><span class="chap__d">${fmtT(s.dur)}</span><span class="chap__p"></span></button>`).join("");
  let acc = 0; $("#scrubMarks").innerHTML = SCENES.slice(0, -1).map((s) => `<i style="left:${((acc += s.dur) / total) * 100}%"></i>`).join("");
  $("#chapters").addEventListener("click", (e) => { const b = e.target.closest(".chap"); if (!b) return; const i = +b.dataset.i; let a = 0; for (let k = 0; k < i; k++) a += SCENES[k].dur; seekGlobal(a); userPaused = false; play(); });
  const toggle = () => { if (playing) { pause(); userPaused = true; } else { userPaused = false; play(); } };
  $("#playBtn").addEventListener("click", toggle); $("#bigPlay").addEventListener("click", toggle);
  vp.addEventListener("click", (e) => { if (e.target.closest("#bigPlay")) return; toggle(); });
  const speeds = [1, 1.5, 2]; $("#speedBtn").addEventListener("click", (e) => { speed = speeds[(speeds.indexOf(speed) + 1) % speeds.length]; e.currentTarget.textContent = speed + "×"; });
  $("#fsBtn").addEventListener("click", () => { document.fullscreenElement ? document.exitFullscreen() : player.requestFullscreen?.(); });
  const scrub = $("#scrub");
  const scrubTo = (ev) => { const r = scrub.getBoundingClientRect(); seekGlobal(((ev.clientX - r.left) / r.width) * total); };
  scrub.addEventListener("pointerdown", (ev) => { scrub.setPointerCapture(ev.pointerId); const was = playing; pause(); scrubTo(ev); const mvH = (e) => scrubTo(e); const up = () => { scrub.removeEventListener("pointermove", mvH); scrub.removeEventListener("pointerup", up); if (was) play(); }; scrub.addEventListener("pointermove", mvH); scrub.addEventListener("pointerup", up); });
  scrub.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") seekGlobal(globalT() + 5000); if (e.key === "ArrowLeft") seekGlobal(globalT() - 5000); });
  player.addEventListener("keydown", (e) => { if (e.key === " " && !e.target.closest("button")) { e.preventDefault(); toggle(); } });

  /* Escala del escenario */
  const fit = () => { scale = vp.clientWidth / W || 1; stage.style.transform = `scale(${scale})`; };
  new ResizeObserver(fit).observe(vp); fit();

  /* Reproducción automática solo cuando está a la vista */
  startScene(0); pause();
  new IntersectionObserver((es) => { inView = es[0].isIntersecting; if (inView && !userPaused && !RM) play(); else if (!inView && playing) pause(); }, { threshold: 0.35 }).observe(player);
  document.addEventListener("visibilitychange", () => { if (document.hidden && playing) pause(); else if (!document.hidden && inView && !userPaused && !RM) play(); });
})();

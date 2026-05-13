// ─── UI Helpers ───────────────────────────────────────────────────────────────

function logoSVG(size=34) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="58" fill="#1B2F5E"/>
    <path d="M36 84 L50 44 L63 62 L76 44 L88 84" stroke="white" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M50 44 Q62 28 74 44" stroke="white" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M74 40 Q89 20 103 31" stroke="white" stroke-width="3" stroke-linecap="round" fill="none" stroke-dasharray="2 3"/>
    <circle cx="103" cy="31" r="3.5" fill="white"/>
  </svg>`;
}

function badge(label, small=false) {
  const [fg, bg] = TAG[label] || [C.gray500, C.gray100];
  const cls = small ? "badge badge-sm" : "badge";
  return `<span class="${cls}" style="color:${fg};background:${bg}">${label}</span>`;
}

function rolePill(role) {
  const [fg, bg] = ROLE_COLORS[role] || [C.gray500, C.gray100];
  const lbl = ROLES_INFO[role]?.label || role;
  return `<span class="badge" style="color:${fg};background:${bg};font-size:10px;font-weight:700">${lbl}</span>`;
}

function av(name, size=30, color=C.navy) {
  const initials = name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  return `<div class="av" style="width:${size}px;height:${size}px;background:${color}1a;color:${color};font-size:${Math.round(size*0.34)}px">${initials}</div>`;
}

function progressBar(pct, color) {
  return `<div class="progress-wrap">
    <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div>
    <span class="progress-pct">${pct}%</span>
  </div>`;
}

function sparkSVG(data, color) {
  const max=Math.max(...data), min=Math.min(...data);
  const norm = v => 28-((v-min)/(max-min||1))*24;
  const pts = data.map((v,i)=>`${(i/(data.length-1))*80},${norm(v)}`).join(" ");
  const last = norm(data[data.length-1]);
  return `<svg width="80" height="28" viewBox="0 0 80 28">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="80" cy="${last}" r="2.5" fill="${color}"/>
  </svg>`;
}

function miniBar(data, color) {
  const max = Math.max(...data.map(d=>d.v));
  return `<div class="mini-bar">${data.map((d,i)=>{
    const h = Math.max(4, (d.v/max)*52);
    const op = 0.55 + (i/data.length)*0.45;
    return `<div class="mini-bar-col">
      <div class="mini-bar-fill" style="height:${h}px;background:${color};opacity:${op}"></div>
      <span class="mini-bar-lbl">${d.l}</span>
    </div>`;
  }).join("")}</div>`;
}

function donut(segs, cx=44, cy=44, r=36, hole=22) {
  let cum = 0;
  const total = segs.reduce((a,s)=>a+s.v,0);
  const arc = (start, end) => {
    const s2=(start/total)*2*Math.PI-Math.PI/2;
    const e2=(end/total)*2*Math.PI-Math.PI/2;
    const laf = end-start>total/2?1:0;
    return `M${cx} ${cy} L${cx+r*Math.cos(s2)} ${cy+r*Math.sin(s2)} A${r} ${r} 0 ${laf} 1 ${cx+r*Math.cos(e2)} ${cy+r*Math.sin(e2)} Z`;
  };
  const paths = segs.map(s=>{
    const p=`<path d="${arc(cum,cum+s.v)}" fill="${s.c}" stroke="white" stroke-width="1.5"/>`;
    cum+=s.v; return p;
  }).join("");
  const legend = segs.map(s=>`<div class="donut-leg-item">
    <div class="donut-leg-dot" style="background:${s.c}"></div>
    <span class="donut-leg-lbl">${s.l}</span>
    <span class="donut-leg-val">${s.v}</span>
  </div>`).join("");
  return `<div class="donut-wrap">
    <svg width="${cx*2}" height="${cy*2}">
      ${paths}
      <circle cx="${cx}" cy="${cy}" r="${hole}" fill="white"/>
      <text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="13" font-weight="700" fill="${C.navy}">${total}</text>
      <text x="${cx}" y="${cy+10}" text-anchor="middle" font-size="8" fill="${C.gray400}">total</text>
    </svg>
    <div class="donut-legend">${legend}</div>
  </div>`;
}

function statCard(label, value, sub, trend, color, icon, sparkData) {
  const trendColor = trend==="up"?C.green:trend==="down"?C.red:C.gray400;
  const trendArrow = trend==="up"?"▲ ":trend==="down"?"▼ ":"";
  return `<div class="stat-card">
    <div class="stat-top">
      <div class="stat-icon" style="background:${color}18">${icon}</div>
      ${sparkData ? sparkSVG(sparkData, color) : ""}
    </div>
    <div class="stat-val">${value}</div>
    <div class="stat-label">${label}</div>
    ${sub ? `<div class="stat-sub" style="color:${trendColor}">${trendArrow}${sub}</div>` : ""}
  </div>`;
}

function buildTable(cols, rows, onRowCb) {
  const ths = cols.map(c=>`<th>${c}</th>`).join("");
  const trs = rows.length===0
    ? `<tr><td colspan="${cols.length}" class="tbl-empty">No records found</td></tr>`
    : rows.map((row,ri)=>{
        const tds = row.map((cell,ci)=>`<td>${cell}</td>`).join("");
        const cb = onRowCb ? `data-row="${ri}"` : "";
        return `<tr ${cb}>${tds}</tr>`;
      }).join("");
  return `<div class="tbl-wrap"><table>
    <thead><tr>${ths}</tr></thead>
    <tbody>${trs}</tbody>
  </table></div>`;
}

function modal(id, title, bodyHtml) {
  return `<div class="modal-overlay" id="${id}">
    <div class="modal-box">
      <div class="modal-head">
        <h3>${title}</h3>
        <button class="modal-close" onclick="closeModal('${id}')">×</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
    </div>
  </div>`;
}

function field(label, inputHtml) {
  return `<div class="field"><label>${label}</label>${inputHtml}</div>`;
}

function input(id, type="text", placeholder="", value="", extra="") {
  return `<input id="${id}" type="${type}" placeholder="${placeholder}" value="${value}" class="input" ${extra}>`;
}

function select(id, options, value="", extra="") {
  const opts = options.map(o=>{
    const v = typeof o==="object"?o.value:o;
    const l = typeof o==="object"?o.label:o;
    return `<option value="${v}" ${v===value?"selected":""}>${l}</option>`;
  }).join("");
  return `<select id="${id}" class="select" ${extra}>${opts}</select>`;
}

function btn(text, cls="btn", onclick="", extra="") {
  return `<button class="${cls}" onclick="${onclick}" ${extra}>${text}</button>`;
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function canAccess(user, page) {
  if (!user) return false;
  if (user.allowedPages.includes("*")) return true;
  return user.allowedPages.includes(page);
}

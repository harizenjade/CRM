// ─── Page Renderers ───────────────────────────────────────────────────────────

// DASHBOARD
function renderDashboard() {
  const monthly=[{l:"Jan",v:38},{l:"Feb",v:52},{l:"Mar",v:61},{l:"Apr",v:74},{l:"May",v:89}];
  const leadStatus=[{l:"New",v:14,c:C.blue},{l:"Follow-up",v:28,c:C.amber},{l:"Proposal",v:17,c:C.purple},{l:"Won",v:22,c:C.green},{l:"Lost",v:8,c:C.red}];
  const revTrend=[42,55,48,67,72,65,80,76,88,95,89,102];
  const leadTrend=[18,24,22,31,28,35,40,38,44,52,48,56];

  const actRows = [
    {icon:"🎯",text:"New lead: NovaTech Mfg added",time:"10 min ago",c:C.blue},
    {icon:"💰",text:"Invoice INV-0091 marked Paid",time:"1 hr ago",c:C.green},
    {icon:"📞",text:"Follow-up call logged for TechSpark",time:"2 hrs ago",c:C.amber},
    {icon:"🎫",text:"Ticket SRT-0034 resolved by Sanjay G",time:"3 hrs ago",c:C.teal},
    {icon:"👤",text:"Groww Finance onboarded as customer",time:"Yesterday",c:C.purple},
  ];

  return `<div class="page-col">
    <div>
      <h2 style="font-size:20px;font-weight:800;color:${C.gray900}">Overview Dashboard</h2>
      <p style="font-size:13px;color:${C.gray400};margin-top:4px">Wednesday, 13 May 2026 · ORCAS CRM PRO</p>
    </div>

    <div class="grid-4">
      ${statCard("Total Customers","248","↑ 11 this month","up",C.navy,"🏢",[20,25,22,30,28,35,32,38,40,44,42,48])}
      ${statCard("Active Leads","89","↑ 8 new this week","up",C.blue,"🎯",leadTrend)}
      ${statCard("Revenue MTD","₹38.4L","↑ 22% vs last month","up",C.green,"💰",revTrend)}
      ${statCard("Open Tickets","12","↓ 4 vs yesterday","down",C.amber,"🎫",[18,16,15,14,16,13,14,12,13,11,13,12])}
    </div>

    <div class="grid-3">
      <div class="card card-pad" style="grid-column:1/3">
        <div class="card-title">Monthly Lead Acquisition</div>
        ${miniBar(monthly, C.navy)}
        <div style="display:flex;gap:20px;margin-top:16px">
          ${[["Total Leads","89"],["Conversion Rate","31.5%"],["Avg Response","2.4h"]].map(([l,v])=>`
            <div><div style="font-size:17px;font-weight:800;color:${C.navy}">${v}</div><div style="font-size:11px;color:${C.gray400}">${l}</div></div>
          `).join("")}
        </div>
      </div>
      <div class="card card-pad">
        <div class="card-title">Lead Status</div>
        ${donut(leadStatus, 42, 42, 34, 20)}
      </div>
    </div>

    <div class="grid-2">
      <div class="card card-pad">
        <div class="card-title">Sales Pipeline</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${PIPELINE.map(p=>`
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="font-size:12px;color:${C.gray600};font-weight:600">${p.stage}</span>
                <div>
                  <span style="font-size:12px;color:${p.color};font-weight:700">${p.count} deals</span>
                  <span style="font-size:12px;color:${C.gray400};margin-left:8px">${p.value}</span>
                </div>
              </div>
              ${progressBar(Math.round((p.count/14)*100), p.color)}
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card card-pad">
        <div class="card-title">Recent Activity</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${actRows.map(a=>`
            <div style="display:flex;gap:10px;align-items:flex-start">
              <div style="width:30px;height:30px;border-radius:8px;background:${a.c}15;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">${a.icon}</div>
              <div>
                <p style="margin:0;font-size:12px;color:${C.gray700};line-height:1.4">${a.text}</p>
                <p style="margin:0;font-size:10px;color:${C.gray400};margin-top:2px">${a.time}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  </div>`;
}

// CUSTOMERS
let customerSearch = "";
function renderCustomers() {
  const filtered = CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.industry.toLowerCase().includes(customerSearch.toLowerCase())
  );
  const counts = [
    ["Total",CUSTOMERS.length,C.navy],
    ["Premium",CUSTOMERS.filter(c=>c.status==="Premium").length,C.purple],
    ["Active",CUSTOMERS.filter(c=>c.status==="Active").length,C.green],
    ["Inactive",CUSTOMERS.filter(c=>c.status==="Inactive").length,C.red],
  ];

  return `<div class="page-col">
    <div class="page-hd">
      <div><h2>Customer Management</h2><p>${CUSTOMERS.length} customers across 6 industries</p></div>
      <button class="btn" onclick="showAddCustomer()">+ Add Customer</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px">
      ${counts.map(([l,v,c])=>`
        <div class="card card-pad" style="padding:14px 16px">
          <div style="font-size:22px;font-weight:800;color:${c}">${v}</div>
          <div style="font-size:11px;color:${C.gray500}">${l}</div>
        </div>
      `).join("")}
    </div>

    <input class="input" style="max-width:320px" placeholder="Search customers, industry…"
      value="${customerSearch}"
      oninput="customerSearch=this.value;rerender()">

    <div class="grid-auto">
      ${filtered.map(c=>`
        <div class="cust-card">
          <div class="cust-head">
            ${av(c.name, 40, C.navy)}
            <div class="cust-info">
              <div class="cust-name">${c.name}</div>
              <div class="cust-meta">${c.industry} · Since ${c.since}</div>
            </div>
            ${badge(c.status)}
          </div>
          <div class="cust-details">
            ${[["Contact",c.contact],["Email",c.email],["Mobile",c.mobile],["Lifetime Value",c.value]].map(([k,v])=>`
              <div><div class="cust-detail-key">${k}</div><div class="cust-detail-val">${v}</div></div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  </div>`;
}

function showAddCustomer() {
  const html = modal("modal-add-cust","Add New Customer",`
    ${field("Company Name", input("nc-name","text","e.g. Acme Pvt Ltd"))}
    ${field("Primary Contact", input("nc-contact","text","Contact person name"))}
    <div class="modal-row">
      ${field("Email", input("nc-email","email",""))}
      ${field("Mobile", input("nc-mobile","tel",""))}
    </div>
    ${field("Industry", select("nc-industry",["IT Services","Manufacturing","Healthcare","Real Estate","Retail","Fintech","Education","Other"]))}
    ${field("Customer Type", select("nc-type",["New Customer","Existing Customer","Premium Customer"]))}
    <div class="modal-actions">
      ${btn("Cancel","btn btn-ghost","closeModal('modal-add-cust')")}
      ${btn("Save Customer","btn","closeModal('modal-add-cust')")}
    </div>
  `);
  document.body.insertAdjacentHTML("beforeend", html);
}

// LEADS
let leadFilter = "All";
let leadSearch = "";
const leadStatuses = ["All","New","Contacted","Follow-up","Proposal Sent","Negotiation","Won","Lost"];

function renderLeads() {
  const filtered = LEADS.filter(l =>
    (leadFilter==="All" || l.status===leadFilter) &&
    (l.name.toLowerCase().includes(leadSearch.toLowerCase()) || l.contact.toLowerCase().includes(leadSearch.toLowerCase()))
  );

  const rows = filtered.map(l=>[
    `<div style="display:flex;gap:10px;align-items:center">${av(l.name,30,C.navy)}<div><div style="font-weight:700;font-size:13px">${l.name}</div><div style="font-size:11px;color:${C.gray400}">${l.contact}</div></div></div>`,
    l.req, l.source, badge(l.priority,true), badge(l.status,true), l.exec, l.created
  ]);

  return `<div class="page-col">
    <div class="page-hd">
      <div><h2>Lead Management</h2><p>${LEADS.length} active leads</p></div>
      <button class="btn" onclick="showAddLead()">+ New Lead</button>
    </div>

    <div class="filter-row">
      <input class="input" style="flex:0 0 260px" placeholder="Search leads…"
        value="${leadSearch}"
        oninput="leadSearch=this.value;rerender()">
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${leadStatuses.map(s=>`
          <button class="filter-btn ${leadFilter===s?"active":""}" onclick="leadFilter='${s}';rerender()">${s}</button>
        `).join("")}
      </div>
    </div>

    <div class="card" style="overflow:hidden">
      ${buildTable(["Lead / Contact","Requirement","Source","Priority","Status","Executive","Created"], rows)}
    </div>
  </div>`;
}

function showAddLead() {
  const html = modal("modal-add-lead","Add New Lead",`
    ${field("Company / Lead Name", input("nl-name","text","Company or individual name"))}
    ${field("Contact Person", input("nl-contact","text","Primary contact"))}
    <div class="modal-row">
      ${field("Email", input("nl-email","email",""))}
      ${field("Mobile", input("nl-mobile","tel",""))}
    </div>
    ${field("Business Requirement", input("nl-req","text","What are they looking for?"))}
    <div class="modal-row">
      ${field("Source", select("nl-source",["Website","Referral","Social Media","Walk-in","LinkedIn","Cold Call"]))}
      ${field("Priority", select("nl-priority",["High","Medium","Low"]))}
    </div>
    ${field("Assign To", select("nl-exec",["Ravi K","Preethi S","Karthik R"]))}
    <div class="modal-actions">
      ${btn("Cancel","btn btn-ghost","closeModal('modal-add-lead')")}
      ${btn("Create Lead","btn","closeModal('modal-add-lead')")}
    </div>
  `);
  document.body.insertAdjacentHTML("beforeend", html);
}

// PIPELINE
function renderPipeline() {
  const active = LEADS.filter(l=>!["Won","Lost"].includes(l.status));
  const rows = active.map((l,i)=>[
    l.name, l.req, badge(l.priority,true), badge(l.status,true),
    `₹${i%3+3+i*2}L`, `2026-05-${20+i}`, l.exec
  ]);

  return `<div class="page-col">
    <div>
      <h2 style="font-size:20px;font-weight:800;color:${C.gray900}">Sales Pipeline</h2>
      <p style="font-size:13px;color:${C.gray400};margin-top:3px">43 deals · ₹100L total pipeline value</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px">
      ${PIPELINE.map(p=>`
        <div class="stage-card" style="border-top-color:${p.color};border:2px solid ${p.color}22;border-top:3px solid ${p.color}">
          <div class="stage-count" style="color:${p.color}">${p.count}</div>
          <div class="stage-name">${p.stage}</div>
          <div class="stage-val">${p.value} value</div>
          ${progressBar(Math.round((p.count/14)*100), p.color)}
        </div>
      `).join("")}
    </div>

    <div class="card" style="overflow:hidden">
      <div style="padding:16px 20px;border-bottom:1px solid ${C.gray100};display:flex;justify-content:space-between;align-items:center">
        <h3 style="margin:0;font-size:14px;font-weight:700;color:${C.gray800}">Active Opportunities</h3>
        <button class="btn">+ New Opportunity</button>
      </div>
      ${buildTable(["Lead","Requirement","Priority","Stage","Value","Expected Close","Exec"], rows)}
    </div>
  </div>`;
}

// EMPLOYEES
function renderEmployees() {
  const deptColor = d => d==="Sales"?C.blue:d==="HR"?C.purple:d==="Tech"?C.teal:C.amber;

  return `<div class="page-col">
    <div class="page-hd">
      <div><h2>Employee Management</h2><p>${EMPLOYEES.length} employees</p></div>
      <button class="btn">+ Add Employee</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">
      ${EMPLOYEES.map(e=>`
        <div class="emp-card">
          <div class="emp-head">
            ${av(e.name, 42, deptColor(e.dept))}
            <div>
              <div style="font-weight:700;font-size:14px;color:${C.gray900}">${e.name}</div>
              <div style="font-size:11px;color:${C.gray400}">${e.designation}</div>
              <span class="badge" style="font-size:10px;background:${C.navy}15;color:${C.navy};margin-top:3px">${e.dept}</span>
            </div>
          </div>
          <div class="emp-metrics">
            <div>
              <div class="emp-metric-lbl">Attendance</div>
              ${progressBar(e.attendance, e.attendance>=90?C.green:C.amber)}
            </div>
            <div>
              <div class="emp-metric-lbl">KPI Score</div>
              ${progressBar(e.kpi, e.kpi>=85?C.blue:C.amber)}
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-top:4px">
              <span style="color:${C.gray400}">Active Tasks</span>
              <span style="font-weight:700;color:${C.navy}">${e.tasks}</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  </div>`;
}

// TASKS
function renderTasks() {
  const cols = [
    {s:"Pending",c:C.amber},
    {s:"In Progress",c:C.purple},
    {s:"Completed",c:C.green},
  ];

  return `<div class="page-col">
    <div class="page-hd">
      <div><h2>Task & Activity Management</h2><p>${TASKS.filter(t=>t.status!=="Completed").length} open tasks</p></div>
      <button class="btn">+ New Task</button>
    </div>

    <div class="kanban">
      ${cols.map(col=>{
        const colTasks = TASKS.filter(t=>t.status===col.s);
        return `<div class="kanban-col">
          <div class="kanban-head" style="border-bottom:2px solid ${col.c}">
            <div class="kanban-dot" style="background:${col.c}"></div>
            <span class="kanban-title">${col.s}</span>
            <span class="kanban-count" style="background:${col.c}20;color:${col.c}">${colTasks.length}</span>
          </div>
          <div>
            ${colTasks.length===0
              ? `<p class="kanban-empty">No tasks</p>`
              : colTasks.map(t=>`
                <div class="task-item">
                  <div class="task-row">
                    <div class="task-check ${t.status==="Completed"?"done":""}" onclick="toggleTask(${t.id})"></div>
                    <div style="flex:1">
                      <p class="task-title ${t.status==="Completed"?"done":""}">${t.title}</p>
                      <div class="task-meta">
                        ${badge(t.priority,true)}
                        <span style="font-size:10px;color:${C.gray400}">Due ${t.due}</span>
                      </div>
                      <p class="task-assignee">${t.assignee} · ${t.project}</p>
                    </div>
                  </div>
                </div>
              `).join("")}
          </div>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

function toggleTask(id) {
  const t = TASKS.find(t=>t.id===id);
  if (!t) return;
  t.status = t.status==="Completed" ? "Pending" : "Completed";
  rerender();
}

// INVOICES
function renderInvoices() {
  const rows = INVOICES.map(inv=>[
    `<span class="mono" style="color:${C.navy}">${inv.id}</span>`,
    inv.customer, inv.amount, inv.gst,
    `<span style="font-weight:700;color:${C.gray900}">${inv.total}</span>`,
    inv.date, inv.due, badge(inv.status, true)
  ]);
  const summaries = [
    ["Total Billed","₹11,68,200",C.navy,"💳"],
    ["Collected","₹4,66,100",C.green,"✅"],
    ["Pending","₹3,24,500",C.amber,"⏳"],
    ["Overdue","₹3,77,600",C.red,"⚠️"],
  ];

  return `<div class="page-col">
    <div class="page-hd">
      <div><h2>Invoice & Finance</h2><p>${INVOICES.length} invoices this month</p></div>
      <button class="btn" onclick="showNewInvoice()">+ New Invoice</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">
      ${summaries.map(([l,v,c,i])=>`
        <div class="inv-summary-card" style="border-left:3px solid ${c}">
          <div class="inv-summary-icon">${i}</div>
          <div class="inv-summary-val" style="color:${c}">${v}</div>
          <div class="inv-summary-lbl">${l}</div>
        </div>
      `).join("")}
    </div>

    <div class="card" style="overflow:hidden">
      ${buildTable(["Invoice #","Customer","Amount","GST (18%)","Total","Date","Due Date","Status"], rows)}
    </div>
  </div>`;
}

function showNewInvoice() {
  const custOpts = CUSTOMERS.map(c=>({value:c.name,label:c.name}));
  const html = modal("modal-new-inv","Create New Invoice",`
    ${field("Customer", select("ni-cust", custOpts))}
    ${field("Invoice Date", input("ni-date","date","","2026-05-13"))}
    ${field("Due Date", input("ni-due","date","","2026-06-12"))}
    <div style="border-top:1px solid ${C.gray100};padding-top:14px;margin-top:4px">
      <div style="font-size:11px;font-weight:700;color:${C.gray500};margin-bottom:10px;text-transform:uppercase">Line Items</div>
      ${[1,2].map(n=>`
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;margin-bottom:8px">
          ${input(`ni-desc${n}`,"text","Description")}
          ${input(`ni-qty${n}`,"number","Qty")}
          ${input(`ni-rate${n}`,"text","Rate ₹")}
        </div>
      `).join("")}
    </div>
    ${field("Notes / Terms", input("ni-notes","text","Payment terms, notes…"))}
    <div class="modal-actions">
      ${btn("Cancel","btn btn-ghost","closeModal('modal-new-inv')")}
      ${btn("Generate Invoice","btn","closeModal('modal-new-inv')")}
    </div>
  `);
  document.body.insertAdjacentHTML("beforeend", html);
}

// SUPPORT
function renderSupport() {
  const counts = [
    ["Open",TICKETS.filter(t=>t.status==="Open").length,C.blue],
    ["In Progress",TICKETS.filter(t=>t.status==="In Progress").length,C.purple],
    ["Escalated",TICKETS.filter(t=>t.status==="Escalated").length,C.red],
    ["Resolved",TICKETS.filter(t=>t.status==="Resolved").length,C.green],
  ];
  const rows = TICKETS.map(t=>[
    `<span class="mono" style="color:${C.navy}">${t.id}</span>`,
    t.customer, t.subject, badge(t.priority,true), badge(t.status,true), t.agent, t.date
  ]);

  return `<div class="page-col">
    <div class="page-hd">
      <div><h2>Support Tickets</h2><p>${TICKETS.length} tickets total</p></div>
      <button class="btn" onclick="showNewTicket()">+ New Ticket</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px">
      ${counts.map(([l,v,c])=>`
        <div class="ticket-summary">
          <div class="ticket-summary-val" style="color:${c}">${v}</div>
          <div class="ticket-summary-lbl">${l}</div>
        </div>
      `).join("")}
    </div>

    <div class="card" style="overflow:hidden">
      ${buildTable(["Ticket ID","Customer","Subject","Priority","Status","Agent","Opened"], rows)}
    </div>
  </div>`;
}

function showNewTicket() {
  const custOpts = CUSTOMERS.map(c=>({value:c.name,label:c.name}));
  const agentOpts = EMPLOYEES.filter(e=>e.dept==="Support"||e.dept==="Tech").map(e=>({value:e.name,label:e.name}));
  const html = modal("modal-new-ticket","Create Support Ticket",`
    ${field("Customer", select("nt-cust", custOpts))}
    ${field("Subject", input("nt-subject","text","Brief description"))}
    <div class="field">
      <label>Description</label>
      <textarea id="nt-desc" class="input" placeholder="Detailed issue…"></textarea>
    </div>
    <div class="modal-row">
      ${field("Priority", select("nt-prio",["High","Medium","Low"]))}
      ${field("Assign Agent", select("nt-agent", agentOpts))}
    </div>
    <div class="modal-actions">
      ${btn("Cancel","btn btn-ghost","closeModal('modal-new-ticket')")}
      ${btn("Open Ticket","btn","closeModal('modal-new-ticket')")}
    </div>
  `);
  document.body.insertAdjacentHTML("beforeend", html);
}

// REPORTS
function renderReports() {
  const rev  = [{l:"Jan",v:28},{l:"Feb",v:35},{l:"Mar",v:42},{l:"Apr",v:31},{l:"May",v:38}];
  const leads= [{l:"Jan",v:38},{l:"Feb",v:52},{l:"Mar",v:61},{l:"Apr",v:44},{l:"May",v:59}];
  const conv = [{l:"Jan",v:8},{l:"Feb",v:12},{l:"Mar",v:15},{l:"Apr",v:11},{l:"May",v:14}];
  const indSegs = [
    {l:"IT",v:8,c:C.blue},{l:"Mfg.",v:5,c:C.teal},{l:"Health",v:4,c:C.green},
    {l:"Realty",v:6,c:C.amber},{l:"Retail",v:3,c:C.purple},{l:"Other",v:4,c:C.gray400},
  ];

  return `<div class="page-col">
    <h2 style="font-size:20px;font-weight:800;color:${C.gray900}">Reports & Analytics</h2>

    <div class="grid-3">
      ${[["Revenue (₹L)",rev,C.green],["Lead Volume",leads,C.navy],["Conversions",conv,C.teal]].map(([t,d,c])=>`
        <div class="card card-pad">
          <div class="card-title">${t}</div>
          ${miniBar(d, c)}
        </div>
      `).join("")}
    </div>

    <div class="grid-2">
      <div class="card card-pad">
        <div class="card-title">Customers by Industry</div>
        ${donut(indSegs, 48, 48, 38, 24)}
      </div>
      <div class="card card-pad">
        <div class="card-title">Sales Executive Performance</div>
        <div class="exec-perf">
          ${[["Ravi Kumar",14,C.blue],["Preethi Selvam",10,C.purple],["Karthik Rajan",12,C.teal]].map(([n,v,c])=>`
            <div class="exec-row">
              <div class="exec-info">
                <span class="exec-name">${n}</span>
                <span style="color:${c};font-weight:700">${v} deals</span>
              </div>
              ${progressBar(Math.round((v/14)*100), c)}
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  </div>`;
}

// SETTINGS
function renderSettings() {
  const plans = [
    { name:"Basic",        price:"₹2,499",  users:"Up to 5",     c:C.blue,
      features:["Lead Management","Customer Management","Basic Reports","Email Support"] },
    { name:"Professional", price:"₹6,999",  users:"Up to 25",    c:C.teal, popular:true,
      features:["All Basic Features","Sales Pipeline","Invoice Module","WhatsApp Integration","Priority Support","Custom Fields"] },
    { name:"Enterprise",   price:"Custom",  users:"Unlimited",   c:C.purple,
      features:["All Professional Features","White Label","Multi-Company","AI Assistant","Dedicated Support","SLA Guarantee"] },
  ];
  const companyFields=[
    ["Company Name","ZENJADE AUTOMATION TECHNOLOGY PVT LTD"],
    ["GST Number","33AAACZ1234A1Z5"],
    ["Email","info@zenjade.com"],
    ["Phone","+91 44 4001 2345"],
    ["Address","Chennai, Tamil Nadu"],
  ];
  const sysFields=[
    ["Default Currency","INR (₹)"],
    ["Timezone","Asia/Kolkata (IST)"],
    ["Date Format","DD-MM-YYYY"],
    ["Language","English"],
    ["Financial Year","April – March"],
  ];

  return `<div class="page-col">
    <h2 style="font-size:20px;font-weight:800;color:${C.gray900}">Settings & Configuration</h2>

    <div class="grid-2">
      ${[["Company Information",companyFields],["System Configuration",sysFields]].map(([title,fields])=>`
        <div class="card card-pad">
          <h3 style="font-size:14px;font-weight:700;color:${C.gray800};margin-bottom:16px">${title}</h3>
          ${fields.map(([l,v])=>field(l,`<input class="input" value="${v}">`)).join("")}
          <button class="btn" style="margin-top:8px">Save Changes</button>
        </div>
      `).join("")}
    </div>

    <div class="card card-pad">
      <h3 style="font-size:14px;font-weight:700;color:${C.gray800};margin-bottom:4px">Subscription Plans</h3>
      <p style="font-size:12px;color:${C.gray400};margin-bottom:18px">ORCAS CRM PRO · SaaS Pricing</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
        ${plans.map(p=>`
          <div class="plan-card" style="border-color:${p.popular?p.c:C.gray200}">
            ${p.popular?`<div class="plan-badge" style="background:${p.c}">POPULAR</div>`:""}
            <div class="plan-name" style="color:${p.c}">${p.name}</div>
            <div class="plan-price">${p.price}<span class="plan-price-mo">/mo</span></div>
            <div class="plan-users">${p.users} users</div>
            ${p.features.map(f=>`<div class="plan-feature"><span class="plan-feature-tick" style="color:${p.c}">✓</span>${f}</div>`).join("")}
            <button class="plan-upgrade" style="border:1.5px solid ${p.c};color:${p.popular?'white':p.c};background:${p.popular?p.c:'transparent'}">
              ${p.name==="Enterprise"?"Contact Sales":"Upgrade"}
            </button>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="card card-pad">
      <h3 style="font-size:14px;font-weight:700;color:${C.gray800};margin-bottom:14px">Role Management</h3>
      <div class="role-grid">
        ${["Super Admin","Manager","Sales Executive","HR","Employee","Viewer"].map(role=>`
          <div class="role-tile">
            <div class="role-tile-icon">👤</div>
            <div class="role-tile-lbl">${role}</div>
          </div>
        `).join("")}
      </div>
    </div>
  </div>`;
}

// USER MANAGEMENT
let umUsers = [];
function renderUserManagement(currentUser) {
  const rows = umUsers.map(u=>[
    `<div style="display:flex;align-items:center;gap:10px">${av(u.name,32,C.navy)}<div><div style="font-weight:700">${u.name}</div><div style="font-size:11px;color:${C.gray400}">${u.email}</div></div></div>`,
    `<code class="code-pill">${u.username}</code>`,
    rolePill(u.role),
    u.dept,
    badge(u.active?"Active":"Inactive",true),
    u.createdAt,
    currentUser.role==="super_admin" ? `
      <div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="showEditUser('${u.id}')">Edit</button>
        ${u.id!==currentUser.id?`<button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')">Del</button>`:""}
      </div>
    ` : "—"
  ]);

  return `<div class="page-col">
    <div class="page-hd">
      <div><h2>User Management</h2><p>${umUsers.length} system users</p></div>
      ${currentUser.role==="super_admin"?`<button class="btn" onclick="showCreateUser()">+ Create User</button>`:""}
    </div>
    <div id="um-msg"></div>
    <div class="card" style="overflow:hidden">
      ${buildTable(["User","Username","Role","Dept","Status","Created","Actions"], rows)}
    </div>
  </div>`;
}

function showUmMsg(type, text) {
  const el = document.getElementById("um-msg");
  if (!el) return;
  el.innerHTML = `<div class="msg-box msg-${type}">${type==="success"?"✅ ":"⚠️ "}${text}</div>`;
  setTimeout(()=>{ el.innerHTML=""; }, 4000);
}

function showCreateUser() {
  const roleOpts = Object.entries(ROLES_INFO).map(([k,v])=>({value:k,label:v.label}));
  const html = modal("modal-create-user","Create New User",`
    <div id="cu-err" class="hidden" style="background:#FEF2F2;color:#DC2626;border:1px solid #fca5a5;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:14px"></div>
    ${field("Full Name", input("cu-name","text","e.g. Ravi Kumar"))}
    ${field("Email", input("cu-email","email","email@zenjade.com"))}
    ${field("Department", input("cu-dept","text","e.g. Sales, HR, Tech"))}
    ${field("Role", select("cu-role", roleOpts, "sales_executive"))}
    ${field("Password (blank = auto-generate)", input("cu-pass","text","Leave blank to auto-generate"))}
    <div class="modal-actions">
      ${btn("Cancel","btn btn-ghost","closeModal('modal-create-user')")}
      ${btn("Create User","btn","submitCreateUser()")}
    </div>
  `);
  document.body.insertAdjacentHTML("beforeend", html);
}

async function submitCreateUser() {
  const name=document.getElementById("cu-name").value;
  const email=document.getElementById("cu-email").value;
  const dept=document.getElementById("cu-dept").value;
  const role=document.getElementById("cu-role").value;
  const password=document.getElementById("cu-pass").value;
  const errEl=document.getElementById("cu-err");
  if (!name||!email||!dept) { errEl.textContent="Name, email and dept are required."; errEl.classList.remove("hidden"); return; }
  try {
    const res = await fetch(API_BASE+"/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,dept,role,password:password||undefined})});
    const data = await res.json();
    if (!res.ok) throw new Error(data.error||"Failed");
    closeModal("modal-create-user");
    showUmMsg("success",`User created! Username: ${data.credentials.username} · Password: ${data.credentials.password}`);
    await loadUsers();
    rerender();
  } catch(e) { errEl.textContent=e.message; errEl.classList.remove("hidden"); }
}

function showEditUser(id) {
  const u = umUsers.find(u=>u.id===id);
  if (!u) return;
  const roleOpts = Object.entries(ROLES_INFO).map(([k,v])=>({value:k,label:v.label}));
  const statusOpts = [{value:"true",label:"Active"},{value:"false",label:"Inactive"}];
  const html = modal("modal-edit-user",`Edit User: ${u.name}`,`
    <div id="eu-err" class="hidden" style="background:#FEF2F2;color:#DC2626;border:1px solid #fca5a5;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:14px"></div>
    ${field("Full Name", input("eu-name","text","",u.name))}
    ${field("Email", input("eu-email","email","",u.email))}
    ${field("Department", input("eu-dept","text","",u.dept))}
    ${field("Role", select("eu-role", roleOpts, u.role))}
    ${field("New Password (blank = no change)", input("eu-pass","text","Leave blank to keep current"))}
    ${field("Status", select("eu-status", statusOpts, String(u.active)))}
    <div class="modal-actions">
      ${btn("Cancel","btn btn-ghost","closeModal('modal-edit-user')")}
      ${btn("Save Changes","btn",`submitEditUser('${u.id}')`)}
    </div>
  `);
  document.body.insertAdjacentHTML("beforeend", html);
}

async function submitEditUser(id) {
  const name=document.getElementById("eu-name").value;
  const email=document.getElementById("eu-email").value;
  const dept=document.getElementById("eu-dept").value;
  const role=document.getElementById("eu-role").value;
  const password=document.getElementById("eu-pass").value;
  const active=document.getElementById("eu-status").value==="true";
  const errEl=document.getElementById("eu-err");
  try {
    const body={name,email,dept,role,active};
    if(password) body.password=password;
    const res=await fetch(API_BASE+`/users/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||"Failed");
    closeModal("modal-edit-user");
    showUmMsg("success","User updated.");
    await loadUsers();
    rerender();
  } catch(e) { errEl.textContent=e.message; errEl.classList.remove("hidden"); }
}

async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;
  try {
    const res=await fetch(API_BASE+`/users/${id}`,{method:"DELETE"});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||"Failed");
    showUmMsg("success","User deleted.");
    await loadUsers();
    rerender();
  } catch(e) { showUmMsg("error",e.message); }
}

async function loadUsers() {
  try {
    const res=await fetch(API_BASE+"/users");
    const data=await res.json();
    umUsers=data.users;
  } catch(_) {
    umUsers=SEED_USERS.map(({password,...rest})=>rest);
  }
}

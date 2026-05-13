// ─── App State ────────────────────────────────────────────────────────────────
let currentUser = null;
let currentToken = null;
let currentPage = "dashboard";
let sidebarCollapsed = false;
let notifOpen = false;

// ─── Boot ─────────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", async () => {
  const savedUser = localStorage.getItem("crm_user");
  const savedToken = localStorage.getItem("crm_token");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    currentToken = savedToken;
    await loadUsers();
    showApp();
  } else {
    showLogin();
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function showLogin() {
  document.body.innerHTML = `
    <div id="login-screen">
      <div class="login-card">
        <div class="login-header">
          ${logoSVG(40)}
          <div>
            <div class="login-title">ORCAS CRM PRO</div>
            <div class="login-sub">Zenjade Automation Technology</div>
          </div>
        </div>
        <h2>Welcome back</h2>
        <p>Sign in to your CRM account</p>
        <div id="login-err" class="error-box hidden"></div>
        ${field("Username", `<input id="l-user" type="text" class="input" placeholder="e.g. ZAT-001" onkeydown="if(event.key==='Enter')doLogin()">`)}
        ${field("Password", `<input id="l-pass" type="password" class="input" placeholder="Enter password" onkeydown="if(event.key==='Enter')doLogin()">`)}
        ${field("Role", select("l-role",[
          {value:"",label:"— Select your role —"},
          {value:"super_admin",label:"Super Admin"},
          {value:"manager",label:"Manager"},
          {value:"sales_executive",label:"Sales Executive"},
          {value:"hr",label:"HR"},
          {value:"employee",label:"Employee"},
          {value:"viewer",label:"Viewer"},
        ]))}
        <button class="btn btn-full" id="login-btn" onclick="doLogin()">Sign In →</button>
        <div class="role-hints">
          <span class="role-hint-label">Available roles:</span>
          ${["Super Admin","Manager","Sales Executive","HR","Employee","Viewer"].map(r=>`<span class="role-chip">${r}</span>`).join("")}
        </div>
        <p class="login-default">Default: <strong>ZAT-001</strong> / <strong>ZATPL</strong></p>
      </div>
    </div>
  `;
}

function setLoginError(msg) {
  const el = document.getElementById("login-err");
  el.textContent = "⚠️ " + msg;
  el.classList.remove("hidden");
}

function inMemoryLogin(username, password) {
  const user = SEED_USERS.find(u => u.username===username && u.password===password && u.active);
  if (!user) return null;
  const info = ROLES_INFO[user.role];
  return {
    id:user.id, name:user.name, username:user.username, email:user.email,
    role:user.role, roleLabel:info.label, dept:user.dept,
    allowedPages:info.pages, canManageUsers:info.canManageUsers, canDelete:info.canDelete,
  };
}

async function doLogin() {
  const username = document.getElementById("l-user").value.trim();
  const password = document.getElementById("l-pass").value;
  const role     = document.getElementById("l-role").value;
  const btn      = document.getElementById("login-btn");
  if (!username || !password) { setLoginError("Please enter username and password."); return; }
  btn.disabled = true; btn.textContent = "Signing in…";

  try {
    const res = await fetch(API_BASE+"/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
    const data = await res.json();
    if (!res.ok) throw new Error(data.error||"Login failed");
    if (role && data.user.role!==role) { setLoginError(`This account's role is "${data.user.roleLabel}", not "${role.replace("_"," ")}".`); btn.disabled=false; btn.textContent="Sign In →"; return; }
    currentUser=data.user; currentToken=data.token;
    localStorage.setItem("crm_token",data.token);
    localStorage.setItem("crm_user",JSON.stringify(data.user));
    await loadUsers();
    showApp();
  } catch(_) {
    const result = inMemoryLogin(username, password);
    if (!result) { setLoginError("Invalid username or password."); btn.disabled=false; btn.textContent="Sign In →"; return; }
    if (role && result.role!==role) { setLoginError("This account's role doesn't match selected role."); btn.disabled=false; btn.textContent="Sign In →"; return; }
    currentUser=result; currentToken=null;
    localStorage.setItem("crm_user",JSON.stringify(result));
    await loadUsers();
    showApp();
  }
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const notifs = [
  {text:"New lead: NovaTech Mfg added",  time:"10m", color:C.blue},
  {text:"INV-0091 marked paid",           time:"1h",  color:C.green},
  {text:"Ticket SRT-0033 escalated",      time:"2h",  color:C.red},
  {text:"Follow-up: TechSpark overdue",   time:"3h",  color:C.amber},
];

function buildNavItems() {
  const filteredNav = NAV.filter(n => {
    if (n.id==="users") return currentUser.role==="super_admin" || currentUser.canManageUsers;
    return canAccess(currentUser, n.id);
  });
  return filteredNav.map(n=>`
    <button class="nav-btn ${currentPage===n.id?"active":""}" onclick="navigate('${n.id}')">
      <span class="nav-icon">${n.icon}</span>
      <span class="nav-label">${n.label}</span>
    </button>
  `).join("");
}

function showApp() {
  const initials = currentUser.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const roleLabel = ROLES_INFO[currentUser.role]?.label || currentUser.role;

  document.body.innerHTML = `
    <div id="app-shell">
      <!-- Sidebar -->
      <aside id="sidebar">
        <div class="sidebar-logo">
          ${logoSVG(34)}
          <div class="sidebar-logo-text">
            <div class="brand">ORCAS</div>
            <div class="brand-sub">CRM PRO · Zenjade</div>
          </div>
        </div>

        <nav id="sidebar-nav">${buildNavItems()}</nav>

        <div class="sidebar-plan">
          <div class="sidebar-plan-inner">
            <div class="pl">Current Plan</div>
            <div class="pn">Professional</div>
            <div class="ps">23 / 25 users · Renews Jun 2026</div>
          </div>
        </div>

        <div class="sidebar-user">
          <div class="av" style="width:32px;height:32px;background:${C.blue};color:white;font-size:12px;font-weight:700;flex-shrink:0">${initials}</div>
          <div class="sidebar-user-info">
            <div class="uname">${currentUser.name}</div>
            <div class="urole">${roleLabel}</div>
          </div>
          <button class="logout-btn" onclick="doLogout()" title="Logout">⏻</button>
        </div>
      </aside>

      <!-- Main -->
      <div id="main-content">
        <header id="topbar">
          <button class="menu-toggle" onclick="toggleSidebar()">☰</button>
          <div class="topbar-flex">
            <span id="page-title">Dashboard</span>
            <span id="page-sub">ORCAS CRM PRO</span>
          </div>
          <div class="search-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search anything…">
          </div>
          <div class="notif-wrap">
            <button class="notif-btn" onclick="toggleNotif()">
              🔔<span class="notif-dot"></span>
            </button>
            <div class="notif-dropdown" id="notif-dd">
              <div class="notif-header">Notifications</div>
              ${notifs.map(n=>`
                <div class="notif-item">
                  <span class="notif-dot-sm" style="background:${n.color}"></span>
                  <div>
                    <div class="notif-text">${n.text}</div>
                    <div class="notif-time">${n.time} ago</div>
                  </div>
                </div>
              `).join("")}
              <div class="notif-footer"><button onclick="toggleNotif()">View all</button></div>
            </div>
          </div>
          <div class="date-chip">Wed 13 May 2026</div>
        </header>

        <main id="page-area"></main>
      </div>
    </div>
  `;

  navigate("dashboard");
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function navigate(page) {
  currentPage = page;
  // Update nav
  document.querySelectorAll(".nav-btn").forEach(b=>{
    b.classList.toggle("active", b.getAttribute("onclick")===`navigate('${page}')`);
  });
  // Update title
  const navItem = NAV.find(n=>n.id===page);
  const titleEl = document.getElementById("page-title");
  if (titleEl && navItem) titleEl.textContent = navItem.label;

  // Render page
  const area = document.getElementById("page-area");
  if (!area) return;

  if (!canAccess(currentUser, page) && page!=="users") {
    area.innerHTML = `<div class="access-denied"><span>🔒</span><h3>Access Restricted</h3><p>You don't have permission to view this page.</p></div>`;
    return;
  }

  switch(page) {
    case "dashboard":  area.innerHTML = renderDashboard(); break;
    case "customers":  area.innerHTML = renderCustomers(); break;
    case "leads":      area.innerHTML = renderLeads(); break;
    case "pipeline":   area.innerHTML = renderPipeline(); break;
    case "employees":  area.innerHTML = renderEmployees(); break;
    case "tasks":      area.innerHTML = renderTasks(); break;
    case "invoices":   area.innerHTML = renderInvoices(); break;
    case "support":    area.innerHTML = renderSupport(); break;
    case "reports":    area.innerHTML = renderReports(); break;
    case "settings":   area.innerHTML = renderSettings(); break;
    case "users":      area.innerHTML = renderUserManagement(currentUser); break;
    default:           area.innerHTML = renderDashboard();
  }
}

function rerender() {
  navigate(currentPage);
}

// ─── Sidebar toggle ───────────────────────────────────────────────────────────
function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  document.getElementById("sidebar").classList.toggle("collapsed", sidebarCollapsed);
}

// ─── Notif toggle ─────────────────────────────────────────────────────────────
function toggleNotif() {
  notifOpen = !notifOpen;
  document.getElementById("notif-dd").classList.toggle("open", notifOpen);
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".notif-wrap")) {
    notifOpen = false;
    const dd = document.getElementById("notif-dd");
    if (dd) dd.classList.remove("open");
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
async function doLogout() {
  if (currentToken) {
    try {
      await fetch(API_BASE+"/auth/logout",{method:"POST",headers:{Authorization:"Bearer "+currentToken}});
    } catch(_) {}
  }
  localStorage.removeItem("crm_token");
  localStorage.removeItem("crm_user");
  currentUser=null; currentToken=null;
  showLogin();
}

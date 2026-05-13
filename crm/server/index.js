const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// ─── In-memory store ─────────────────────────────────────────────────────────
let users = [
  { id:"USR-001",username:"ZAT-001",password:"ZATPL",  role:"super_admin",    name:"Admin User",     email:"admin@zenjade.com",  dept:"Management",active:true,createdAt:"2024-01-01" },
  { id:"USR-002",username:"ZAT-002",password:"ZATPL", role:"manager",        name:"Deepa Mohan",    email:"deepa@zenjade.com",  dept:"Operations", active:true,createdAt:"2024-01-15" },
  { id:"USR-003",username:"ZAT-003",password:"ZATPL", role:"sales_executive",name:"Ravi Kumar",     email:"ravi@zenjade.com",   dept:"Sales",      active:true,createdAt:"2024-02-01" },
  { id:"USR-004",username:"ZAT-004",password:"ZATPL", role:"sales_executive",name:"Preethi Selvam", email:"preethi@zenjade.com",dept:"Sales",      active:true,createdAt:"2024-02-10" },
  { id:"USR-005",username:"ZAT-005",password:"ZATPL", role:"hr",             name:"Anitha Devi",    email:"anitha@zenjade.com", dept:"HR",         active:true,createdAt:"2024-03-01" },
  { id:"USR-006",username:"ZAT-006",password:"ZATPL", role:"employee",       name:"Karthik Rajan",  email:"karthik@zenjade.com",dept:"Sales",      active:true,createdAt:"2024-03-15" },
  { id:"USR-007",username:"ZAT-007",password:"ZATPL", role:"viewer",         name:"Viewer Account", email:"viewer@zenjade.com", dept:"General",    active:true,createdAt:"2024-04-01" },
];

const ROLES = {
  super_admin:     { label:"Super Admin",     pages:["*"],                                                       canManageUsers:true,  canDelete:true },
  manager:         { label:"Manager",          pages:["dashboard","customers","leads","pipeline","employees","tasks","invoices","support","reports"], canManageUsers:false, canDelete:true },
  sales_executive: { label:"Sales Executive",  pages:["dashboard","customers","leads","pipeline","tasks"],        canManageUsers:false, canDelete:false },
  hr:              { label:"HR",               pages:["dashboard","employees","tasks","reports"],                 canManageUsers:false, canDelete:false },
  employee:        { label:"Employee",         pages:["dashboard","tasks"],                                       canManageUsers:false, canDelete:false },
  viewer:          { label:"Viewer",           pages:["dashboard","reports"],                                     canManageUsers:false, canDelete:false },
};

// ─── Auth ────────────────────────────────────────────────────────────────────
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password && u.active);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const info = ROLES[user.role];
  const { password: _, ...safeUser } = user;
  const userOut = {
    ...safeUser,
    roleLabel: info.label,
    allowedPages: info.pages,
    canManageUsers: info.canManageUsers,
    canDelete: info.canDelete,
  };
  res.json({ user: userOut, token: "local-token-" + user.id });
});

app.post("/api/auth/logout", (req, res) => res.json({ ok: true }));

// ─── Users CRUD ──────────────────────────────────────────────────────────────
app.get("/api/users", (req, res) => {
  res.json({ users: users.map(({ password, ...u }) => u) });
});

app.post("/api/users", (req, res) => {
  const { name, email, dept, role, password } = req.body;
  if (!name || !email || !dept) return res.status(400).json({ error: "Name, email, dept required" });
  const num = users.length + 1;
  const username = `ZAT-${String(num).padStart(3,"0")}`;
  const pwd = password || ("ZAT" + Math.random().toString(36).slice(2,7).toUpperCase());
  const id = "USR-" + String(num).padStart(3,"0");
  const newUser = { id, username, password: pwd, role: role||"employee", name, email, dept, active: true, createdAt: new Date().toISOString().slice(0,10) };
  users.push(newUser);
  res.json({ user: (({ password:_, ...u }) => u)(newUser), credentials: { username, password: pwd } });
});

app.put("/api/users/:id", (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const { password, ...rest } = req.body;
  users[idx] = { ...users[idx], ...rest };
  if (password) users[idx].password = password;
  res.json({ ok: true });
});

app.delete("/api/users/:id", (req, res) => {
  users = users.filter(u => u.id !== req.params.id);
  res.json({ ok: true });
});

// ─── Catch-all → index.html ──────────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`ORCAS CRM running at http://localhost:${PORT}`));

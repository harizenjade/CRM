const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// ─── In-memory store ─────────────────────────────────────────────────────────
let users = [
  {
    id: "USR-001",
    username: "ZAT-001",
    password: "ZATPL",
    role: "super_admin",
    name: "Admin User",
    email: "admin@zenjade.com",
    dept: "Management",
    active: true,
    createdAt: "2024-01-01"
  },
  {
    id: "USR-002",
    username: "ZAT-002",
    password: "ZATPL",
    role: "Manager",
    name: "Deepa Mohan",
    email: "deepa@zenjade.com",
    dept: "Operations",
    active: true,
    createdAt: "2024-01-15"
  }
];

const ROLES = {
  super_admin: {
    label: "Super Admin",
    pages: ["*"],
    canManageUsers: true,
    canDelete: true
  },

  manager: {
    label: "Manager",
    pages: [
      "dashboard",
      "customers",
      "leads",
      "pipeline",
      "employees",
      "tasks",
      "invoices",
      "support",
      "reports"
    ],
    canManageUsers: false,
    canDelete: true
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
app.post("/api/auth/login", (req, res) => {

  const { username, password } = req.body;

  const user = users.find(
    u =>
      u.username === username &&
      u.password === password &&
      u.active
  );

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials"
    });
  }

  const info = ROLES[user.role];

  const { password: _, ...safeUser } = user;

  res.json({
    user: {
      ...safeUser,
      roleLabel: info.label,
      allowedPages: info.pages,
      canManageUsers: info.canManageUsers,
      canDelete: info.canDelete
    },

    token: "local-token-" + user.id
  });
});

// ─── Logout ──────────────────────────────────────────────────────────────────
app.post("/api/auth/logout", (req, res) => {
  res.json({ ok: true });
});

// ─── Get Users ───────────────────────────────────────────────────────────────
app.get("/api/users", (req, res) => {

  const safeUsers = users.map(user => {
    const { password, ...rest } = user;
    return rest;
  });

  res.json({
    users: safeUsers
  });
});

// ─── Add User ────────────────────────────────────────────────────────────────
app.post("/api/users", (req, res) => {

  const { name, email, dept, role, password } = req.body;

  if (!name || !email || !dept) {
    return res.status(400).json({
      error: "Name, email, dept required"
    });
  }

  const num = users.length + 1;

  const username = `ZAT-${String(num).padStart(3, "0")}`;

  const pwd =
    password ||
    ("ZAT" + Math.random().toString(36).slice(2, 7).toUpperCase());

  const id = "USR-" + String(num).padStart(3, "0");

  const newUser = {
    id,
    username,
    password: pwd,
    role: role || "employee",
    name,
    email,
    dept,
    active: true,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  users.push(newUser);

  const { password: _, ...safeUser } = newUser;

  res.json({
    user: safeUser,
    credentials: {
      username,
      password: pwd
    }
  });
});

// ─── Update User ─────────────────────────────────────────────────────────────
app.put("/api/users/:id", (req, res) => {

  const index = users.findIndex(
    user => user.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  const { password, ...rest } = req.body;

  users[index] = {
    ...users[index],
    ...rest
  };

  if (password) {
    users[index].password = password;
  }

  res.json({
    ok: true
  });
});

// ─── Delete User ─────────────────────────────────────────────────────────────
app.delete("/api/users/:id", (req, res) => {

  users = users.filter(
    user => user.id !== req.params.id
  );

  res.json({
    ok: true
  });
});

// ─── Catch All ───────────────────────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/index.html")
  );
});

// ─── Server ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`ORCAS CRM running on port ${PORT}`);
});
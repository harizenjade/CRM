// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:4000/api";

const C = {
  navy:"#1B2F5E",navyD:"#152448",blue:"#2563EB",blueL:"#EFF6FF",
  teal:"#0D9488",tealL:"#F0FDFA",amber:"#D97706",amberL:"#FFFBEB",
  red:"#DC2626",redL:"#FEF2F2",green:"#16A34A",greenL:"#F0FDF4",
  purple:"#7C3AED",purpleL:"#F5F3FF",cyan:"#0891B2",cyanL:"#ECFEFF",
  gray50:"#F9FAFB",gray100:"#F3F4F6",gray200:"#E5E7EB",gray300:"#D1D5DB",
  gray400:"#9CA3AF",gray500:"#6B7280",gray600:"#4B5563",gray700:"#374151",
  gray800:"#1F2937",gray900:"#111827",
};

const TAG = {
  "New":[C.blue,C.blueL],"Contacted":[C.cyan,C.cyanL],"Follow-up":[C.amber,C.amberL],
  "Proposal Sent":[C.purple,C.purpleL],"Negotiation":[C.teal,C.tealL],
  "Won":[C.green,C.greenL],"Lost":[C.red,C.redL],"Qualified":[C.teal,C.tealL],
  "Inquiry":[C.blue,C.blueL],"Closed Won":[C.green,C.greenL],"Closed Lost":[C.red,C.redL],
  "High":[C.red,C.redL],"Medium":[C.amber,C.amberL],"Low":[C.blue,C.blueL],
  "Pending":[C.amber,C.amberL],"Paid":[C.green,C.greenL],"Overdue":[C.red,C.redL],
  "Open":[C.blue,C.blueL],"Resolved":[C.green,C.greenL],"Escalated":[C.red,C.redL],
  "In Progress":[C.purple,C.purpleL],"Completed":[C.green,C.greenL],
  "Active":[C.green,C.greenL],"Inactive":[C.gray400,C.gray100],
  "Premium":[C.purple,C.purpleL],"Basic":[C.blue,C.blueL],
  "Professional":[C.teal,C.tealL],"Enterprise":[C.purple,C.purpleL],
};

const ROLE_COLORS = {
  super_admin:[C.red,C.redL], manager:[C.purple,C.purpleL],
  sales_executive:[C.blue,C.blueL], hr:[C.teal,C.tealL],
  employee:[C.green,C.greenL], viewer:[C.gray400,C.gray100],
};

const ROLES_INFO = {
  super_admin:     { label:"Super Admin",     pages:["*"],                                                       canManageUsers:true,  canDelete:true },
  manager:         { label:"Manager",          pages:["dashboard","customers","leads","pipeline","employees","tasks","invoices","support","reports"], canManageUsers:false, canDelete:true },
  sales_executive: { label:"Sales Executive",  pages:["dashboard","customers","leads","pipeline","tasks"],        canManageUsers:false, canDelete:false },
  hr:              { label:"HR",               pages:["dashboard","employees","tasks","reports"],                 canManageUsers:false, canDelete:false },
  employee:        { label:"Employee",         pages:["dashboard","tasks"],                                       canManageUsers:false, canDelete:false },
  viewer:          { label:"Viewer",           pages:["dashboard","reports"],                                     canManageUsers:false, canDelete:false },
};

const SEED_USERS = [
  { id:"USR-001",username:"ZAT-001",password:"ZATPL",  role:"super_admin",    name:"Admin User",     email:"admin@zenjade.com",  dept:"Management",active:true,createdAt:"2024-01-01" },
  { id:"USR-002",username:"ZAT-002",password:"ZATPL2", role:"manager",        name:"Deepa Mohan",    email:"deepa@zenjade.com",  dept:"Operations", active:true,createdAt:"2024-01-15" },
  { id:"USR-003",username:"ZAT-003",password:"ZATPL3", role:"sales_executive",name:"Ravi Kumar",     email:"ravi@zenjade.com",   dept:"Sales",      active:true,createdAt:"2024-02-01" },
  { id:"USR-004",username:"ZAT-004",password:"ZATPL4", role:"sales_executive",name:"Preethi Selvam", email:"preethi@zenjade.com",dept:"Sales",      active:true,createdAt:"2024-02-10" },
  { id:"USR-005",username:"ZAT-005",password:"ZATPL5", role:"hr",             name:"Anitha Devi",    email:"anitha@zenjade.com", dept:"HR",         active:true,createdAt:"2024-03-01" },
  { id:"USR-006",username:"ZAT-006",password:"ZATPL6", role:"employee",       name:"Karthik Rajan",  email:"karthik@zenjade.com",dept:"Sales",      active:true,createdAt:"2024-03-15" },
  { id:"USR-007",username:"ZAT-007",password:"ZATPL7", role:"viewer",         name:"Viewer Account", email:"viewer@zenjade.com", dept:"General",    active:true,createdAt:"2024-04-01" },
];

const NAV = [
  { id:"dashboard",  label:"Dashboard",    icon:"⊞" },
  { id:"customers",  label:"Customers",    icon:"🏢" },
  { id:"leads",      label:"Leads",        icon:"🎯" },
  { id:"pipeline",   label:"Pipeline",     icon:"📊" },
  { id:"employees",  label:"Employees",    icon:"👥" },
  { id:"tasks",      label:"Tasks",        icon:"✅" },
  { id:"invoices",   label:"Invoices",     icon:"🧾" },
  { id:"support",    label:"Support",      icon:"🎫" },
  { id:"reports",    label:"Reports",      icon:"📈" },
  { id:"settings",   label:"Settings",     icon:"⚙️" },
  { id:"users",      label:"User Mgmt",    icon:"👤" },
];

// ─── Data ─────────────────────────────────────────────────────────────────────
const CUSTOMERS = [
  { id:"C001",name:"Infosys BPM",contact:"Rajesh Kumar",email:"rajesh@infosys.com",mobile:"9876000001",industry:"IT Services",status:"Premium",since:"2024-01",value:"₹18.5L" },
  { id:"C002",name:"Bosch India",contact:"Sunita Verma",email:"sunita@bosch.in",mobile:"9845000002",industry:"Manufacturing",status:"Active",since:"2024-03",value:"₹12.2L" },
  { id:"C003",name:"Apollo Hospitals",contact:"Dr. Arjun M",email:"arjun@apollo.com",mobile:"9912000003",industry:"Healthcare",status:"Active",since:"2023-11",value:"₹9.8L" },
  { id:"C004",name:"Prestige Estates",contact:"Meera Shah",email:"meera@prestige.in",mobile:"9823000004",industry:"Real Estate",status:"Premium",since:"2023-08",value:"₹22.1L" },
  { id:"C005",name:"Nykaa Fashion",contact:"Priya Nair",email:"priya@nykaa.com",mobile:"9756000005",industry:"Retail",status:"Inactive",since:"2024-01",value:"₹4.3L" },
  { id:"C006",name:"Groww Finance",contact:"Vikram Sen",email:"vikram@groww.in",mobile:"9634000006",industry:"Fintech",status:"Active",since:"2024-04",value:"₹7.6L" },
];

let LEADS = [
  { id:"L001",name:"TechSpark Pvt Ltd",contact:"Arun Balaji",email:"arun@techspark.in",mobile:"9871234560",source:"Website",req:"ERP Integration",priority:"High",status:"Negotiation",exec:"Ravi K",created:"2026-05-08" },
  { id:"L002",name:"Metro Realty",contact:"Divya Krishnan",email:"divya@metro.in",mobile:"9812345670",source:"Referral",req:"CRM Setup",priority:"High",status:"Proposal Sent",exec:"Preethi S",created:"2026-05-09" },
  { id:"L003",name:"FoodChain India",contact:"Suresh Nair",email:"suresh@foodchain.in",mobile:"9823456780",source:"Social Media",req:"Inventory Module",priority:"Medium",status:"Follow-up",exec:"Karthik R",created:"2026-05-10" },
  { id:"L004",name:"BrightPath Academy",contact:"Anitha S",email:"anitha@bright.in",mobile:"9834567890",source:"Website",req:"Student CRM",priority:"Medium",status:"Contacted",exec:"Ravi K",created:"2026-05-11" },
  { id:"L005",name:"NovaTech Mfg",contact:"Ramesh V",email:"ramesh@novatech.in",mobile:"9845678901",source:"Walk-in",req:"Vendor Management",priority:"Low",status:"New",exec:"Preethi S",created:"2026-05-12" },
  { id:"L006",name:"ZenRec Staffing",contact:"Lakshmi P",email:"lakshmi@zenrec.in",mobile:"9856789012",source:"Referral",req:"Recruitment CRM",priority:"High",status:"Won",exec:"Karthik R",created:"2026-05-06" },
  { id:"L007",name:"DigiPulse Agency",contact:"Nikhil M",email:"nikhil@digipulse.in",mobile:"9867890123",source:"LinkedIn",req:"Client Dashboard",priority:"Medium",status:"Lost",exec:"Ravi K",created:"2026-05-05" },
];

const EMPLOYEES = [
  { id:"E001",name:"Ravi Kumar",dept:"Sales",designation:"Sr. Sales Executive",email:"ravi@zenjade.com",attendance:96,tasks:12,kpi:88 },
  { id:"E002",name:"Preethi Selvam",dept:"Sales",designation:"Sales Executive",email:"preethi@zenjade.com",attendance:91,tasks:9,kpi:82 },
  { id:"E003",name:"Karthik Rajan",dept:"Sales",designation:"Business Dev Exec",email:"karthik@zenjade.com",attendance:88,tasks:14,kpi:79 },
  { id:"E004",name:"Deepa Mohan",dept:"HR",designation:"HR Manager",email:"deepa@zenjade.com",attendance:94,tasks:7,kpi:91 },
  { id:"E005",name:"Sanjay Gupta",dept:"Tech",designation:"Lead Developer",email:"sanjay@zenjade.com",attendance:97,tasks:18,kpi:95 },
  { id:"E006",name:"Anitha Devi",dept:"Support",designation:"Support Exec",email:"anitha@zenjade.com",attendance:90,tasks:11,kpi:85 },
];

const INVOICES = [
  { id:"INV-0091",customer:"Infosys BPM",amount:"₹2,45,000",gst:"₹44,100",total:"₹2,89,100",date:"2026-05-01",due:"2026-05-31",status:"Paid" },
  { id:"INV-0092",customer:"Bosch India",amount:"₹1,80,000",gst:"₹32,400",total:"₹2,12,400",date:"2026-05-05",due:"2026-06-04",status:"Pending" },
  { id:"INV-0093",customer:"Prestige Estates",amount:"₹3,20,000",gst:"₹57,600",total:"₹3,77,600",date:"2026-04-20",due:"2026-05-20",status:"Overdue" },
  { id:"INV-0094",customer:"Groww Finance",amount:"₹95,000",gst:"₹17,100",total:"₹1,12,100",date:"2026-05-10",due:"2026-06-09",status:"Pending" },
  { id:"INV-0095",customer:"Apollo Hospitals",amount:"₹1,50,000",gst:"₹27,000",total:"₹1,77,000",date:"2026-05-12",due:"2026-06-11",status:"Paid" },
];

let TASKS = [
  { id:1,title:"Send proposal to Metro Realty",priority:"High",due:"2026-05-14",status:"Pending",assignee:"Preethi S",project:"CRM Sales" },
  { id:2,title:"Follow up – TechSpark negotiation",priority:"High",due:"2026-05-14",status:"In Progress",assignee:"Ravi K",project:"CRM Sales" },
  { id:3,title:"Onboard Groww Finance account",priority:"Medium",due:"2026-05-16",status:"Pending",assignee:"Karthik R",project:"Onboarding" },
  { id:4,title:"Prepare INV-0092 payment follow-up",priority:"Medium",due:"2026-05-15",status:"Pending",assignee:"Accounts",project:"Finance" },
  { id:5,title:"Update Q2 sales report",priority:"High",due:"2026-05-17",status:"In Progress",assignee:"Ravi K",project:"Reporting" },
  { id:6,title:"Platform demo for BrightPath Academy",priority:"Medium",due:"2026-05-15",status:"Pending",assignee:"Preethi S",project:"CRM Sales" },
  { id:7,title:"Fix support ticket SRT-0034",priority:"Low",due:"2026-05-18",status:"Completed",assignee:"Sanjay G",project:"Tech" },
  { id:8,title:"HR policy update document",priority:"Low",due:"2026-05-19",status:"Completed",assignee:"Deepa M",project:"HR" },
];

const TICKETS = [
  { id:"SRT-0031",customer:"Infosys BPM",subject:"Dashboard not loading on mobile",priority:"High",status:"Open",agent:"Anitha D",date:"2026-05-12" },
  { id:"SRT-0032",customer:"Bosch India",subject:"Invoice PDF download error",priority:"Medium",status:"In Progress",agent:"Sanjay G",date:"2026-05-11" },
  { id:"SRT-0033",customer:"Apollo Hospitals",subject:"User role permission issue",priority:"High",status:"Escalated",agent:"Anitha D",date:"2026-05-10" },
  { id:"SRT-0034",customer:"Groww Finance",subject:"WhatsApp notification not triggered",priority:"Low",status:"Resolved",agent:"Sanjay G",date:"2026-05-09" },
  { id:"SRT-0035",customer:"Prestige Estates",subject:"Lead import CSV format query",priority:"Low",status:"Resolved",agent:"Anitha D",date:"2026-05-08" },
];

const PIPELINE = [
  { stage:"Inquiry",count:14,value:"₹28L",color:"#2563EB" },
  { stage:"Qualified",count:9,value:"₹19L",color:"#0891B2" },
  { stage:"Proposal",count:6,value:"₹14L",color:"#7C3AED" },
  { stage:"Negotiation",count:4,value:"₹11L",color:"#D97706" },
  { stage:"Closed Won",count:7,value:"₹22L",color:"#16A34A" },
  { stage:"Closed Lost",count:3,value:"₹6L",color:"#DC2626" },
];

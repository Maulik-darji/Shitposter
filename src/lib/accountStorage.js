const KEY = "shitposter_account_v1";

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function randomIp() {
  const a = 120 + Math.floor(Math.random() * 80);
  const b = Math.floor(Math.random() * 255);
  const c = Math.floor(Math.random() * 255);
  const d = Math.floor(Math.random() * 255);
  return `${a}.${b}.${c}.${d}`;
}

export function defaultAccount() {
  const now = new Date();
  return {
    authMethod: "email", // "email" | "oauth" | "anonymous"
    password: "password123", // Default for demo
    name: "Maulik Darji",
    username: "MaulikDarji2005",
    handle: "@MaulikDarji2005",
    bio: "IN living in DE \ud83d\udccd Ahmedabad, Gujarat \ud83d\udce9 maulik.darji2005@gmail.com",
    location: "Ahmadabad City, India",
    website: "",
    email: "maulikdarjipersonal@gmail.com",
    emailVerified: false,
    phone: "",
    phoneVerified: false,
    protectedPosts: false,
    createdAt: "2022-07-13T16:29:35Z",
    createdIp: "122.170.49.208",
    country: "India",
    countryOther: "",
    languages: ["English", "Indonesian"],
    feedLanguages: [], // if empty => show all
    gender: "Male",
    genderOther: "",
    birthdate: "2005-06-13", // YYYY-MM-DD
    automation: false,
    parodyInfo: "",
  };
}

export function loadAccount() {
  const raw = localStorage.getItem(KEY);
  const parsed = raw ? safeParse(raw) : null;
  if (!parsed || typeof parsed !== "object") return null;
  return parsed;
}

export function saveAccount(account) {
  localStorage.setItem(KEY, JSON.stringify(account));
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("shitposter:account", { detail: account }));
    }
  } catch {
    // ignore
  }
}

export function ensureAccount() {
  const current = loadAccount();
  if (current) return current;
  const next = defaultAccount();
  saveAccount(next);
  return next;
}

export function accountAge(account) {
  const b = String(account?.birthdate || "");
  if (!b) return null;
  const d = new Date(`${b}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

export function formatBirthdate(account) {
  const b = String(account?.birthdate || "");
  if (!b) return "";
  const d = new Date(`${b}T00:00:00`);
  if (Number.isNaN(d.getTime())) return b;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function verifyPassword(password) {
  const account = loadAccount() || defaultAccount();
  return account.password === password;
}

export function updateAccount(updates) {
  const current = loadAccount() || defaultAccount();
  const updated = { ...current, ...updates };
  saveAccount(updated);
  return updated;
}

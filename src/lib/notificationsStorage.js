const NOTIFS_KEY = "textpulse_notifications_v1";
const LEADER_KEY = "textpulse_daily_leader_v1";

export function loadNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveNotifications(notifs) {
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs));
}

export function loadDailyLeader() {
  try {
    const raw = localStorage.getItem(LEADER_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveDailyLeader(obj) {
  localStorage.setItem(LEADER_KEY, JSON.stringify(obj));
}


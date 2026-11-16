export const PERIODS = [
  { key: "today", label: "Today", days: 1 },
  { key: "7d", label: "Last 7 Days", days: 7 },
  { key: "14d", label: "Last 14 Days", days: 14 },
  { key: "30d", label: "Last 30 Days", days: 30 },
  { key: "all", label: "All Time", days: null },
];

export function periodLabel(key) {
  return PERIODS.find((p) => p.key === key)?.label || "Selected Period";
}

export function periodStart(key) {
  const preset = PERIODS.find((p) => p.key === key);
  if (!preset || !preset.days) return null;
  const start = new Date();
  if (preset.days > 1) start.setDate(start.getDate() - (preset.days - 1));
  start.setHours(0, 0, 0, 0);
  return start;
}

export function localDateKey(value) {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function sourceLabel(referrer) {
  if (!referrer) return "Direct";
  const host = String(referrer).replace(/^https?:\/\//i, "").split("/")[0];
  return host || "Direct";
}

export const CHANNELS = {
  social: { key: "social", label: "Social Media", color: "hsl(var(--accent))" },
  direct: { key: "direct", label: "Direct", color: "hsl(var(--primary))" },
  search: { key: "search", label: "Search Engines", color: "hsl(var(--secondary))" },
  email: { key: "email", label: "Email", color: "hsl(var(--chart-5))" },
  referral: { key: "referral", label: "Other Referrals", color: "hsl(var(--muted-foreground))" },
};

const SOCIAL_HOSTS = [
  "facebook.com", "fb.com", "instagram.com", "linkedin.com", "lnkd.in", "tiktok.com",
  "twitter.com", "x.com", "t.co", "pinterest.com", "youtube.com", "youtu.be",
  "nextdoor.com", "threads.net", "snapchat.com", "reddit.com", "whatsapp.com",
  "tumblr.com", "quora.com", "medium.com", "redd.it", "nextdoor.co.uk",
];

const SEARCH_HOSTS = [
  "google.", "bing.com", "yahoo.", "duckduckgo.com", "ecosia.org",
  "yandex.", "baidu.com", "ask.com", "aol.com", "brave.com",
];

const EMAIL_HOSTS = [
  "mail.google.com", "outlook.live.com", "outlook.office.com", "mail.yahoo.com",
  "mail.aol.com", "mail.icloud.com", "protonmail.com", "mail.proton.me",
];

const matchesHost = (host, list) =>
  list.some((entry) => host === entry || host.endsWith(`.${entry}`) || host.includes(entry));

// Reloads, internal navigation and the builder preview all report the app
// itself as the referrer — they are not an outside audience source.
const APP_HOSTS = ["familycareworkforce.com", "base44.app", "app.base44.com"];

const isInternalHost = (host) =>
  (typeof window !== "undefined" && host === window.location.hostname.toLowerCase()) ||
  APP_HOSTS.some((entry) => host === entry || host.endsWith(`.${entry}`));

// Groups a visit's referrer into the channel the visitor arrived through.
export function classifyChannel(referrer) {
  if (!referrer) return "direct";
  const host = sourceLabel(referrer).toLowerCase();
  if (!host || host === "direct") return "direct";
  if (isInternalHost(host)) return "direct";
  if (matchesHost(host, EMAIL_HOSTS)) return "email";
  if (matchesHost(host, SEARCH_HOSTS)) return "search";
  if (matchesHost(host, SOCIAL_HOSTS)) return "social";
  return "referral";
}

export function countryName(code) {
  if (!code) return "Unknown";
  const cc = String(code).trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return code;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(cc) || cc;
  } catch {
    return cc;
  }
}

export function formatTimestamp(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
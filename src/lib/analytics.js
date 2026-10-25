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
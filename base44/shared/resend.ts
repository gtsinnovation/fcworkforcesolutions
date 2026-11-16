import { secrets } from "base44:runtime";

const RESEND_API = "https://api.resend.com/emails";

// Every staff notification goes to this single office inbox. Callers can never
// choose a recipient, so this endpoint cannot be used as a mail relay.
export const ORG_EMAIL = "fcworkforcesolution@gmail.com";

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function emailShell(title, rows, message) {
  const body = rows
    .map(([label, value]) => `<p style="margin:0 0 10px;font-size:14px;color:#0a2547"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value || "Not provided")}</p>`)
    .join("");

  const note = message
    ? `<p style="margin:18px 0 4px;font-size:14px;color:#0a2547"><strong>Message:</strong></p>
       <p style="margin:0;font-size:14px;line-height:1.6;color:#0a2547;white-space:pre-wrap">${escapeHtml(message)}</p>`
    : "";

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f7f7f8;padding:24px">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb">
        <div style="background:#0a2547;padding:16px 24px">
          <img src="https://media.base44.com/images/public/6a50456441d8a4a42f7c8722/6641ab268_logov2.png" alt="Family Care Workforce" style="height:32px;display:block" />
        </div>
        <div style="padding:24px">
          <h2 style="margin:0 0 16px;font-size:18px;color:#0a2547">${escapeHtml(title)}</h2>
          ${body}
          ${note}
        </div>
        <div style="background:#0a2547;color:#ffffff;padding:12px 24px;font-size:12px">Family Care Workforce Solutions</div>
      </div>
    </div>
  `;
}

export async function sendOrgNotification({ subject, html, text, replyTo }) {
  const apiKey = secrets.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("Email provider is not configured.");

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "FCWS <onboarding@resend.dev>",
      to: [ORG_EMAIL],
      subject,
      html,
      ...(text ? { text } : {}),
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Email provider error");
  return data;
}
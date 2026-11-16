import { sendOrgNotification, emailShell } from "../../shared/resend.ts";

// Public contact-form endpoint.
//
// SECURITY: this function never accepts a recipient, subject or raw HTML from the
// caller. It only forwards a validated contact message to the office inbox, so it
// cannot be used as an open mail relay, and every visitor-supplied value is
// HTML-escaped in the shared shell.
export default async function (req) {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json().catch(() => ({}));

    if (body.type !== "contact") {
      return Response.json({ error: "Unsupported request type." }, { status: 400 });
    }

    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
    const message = String(body.message || "").trim().slice(0, 4000);

    if (!name || !message) {
      return Response.json({ error: "Please include your name and a message." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    await sendOrgNotification({
      subject: `New contact message — ${name}`,
      replyTo: email,
      html: emailShell("New Contact Form Message", [["Name", name], ["Email", email]], message),
      text: `New contact message\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
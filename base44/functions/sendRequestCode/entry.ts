import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const CODE_TTL_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;
// Ceiling on codes issued across the whole site in a short window, so the
// endpoint cannot be used to email-bomb arbitrary addresses at scale.
const WINDOW_LIMIT = 40;
const LIMIT_WINDOW_MINUTES = 10;

export default async function (req) {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const admin = base44.asServiceRole;

    // Throttle: one code per address per minute
    const { items } = await admin.entities.RequestVerification.filter({ email }, { sort: "-created_date", limit: 1 });
    const last = items[0];
    if (last && Date.now() - new Date(last.created_date).getTime() < RESEND_COOLDOWN_SECONDS * 1000) {
      return Response.json(
        { error: "A code was just sent. Please wait a minute before requesting another." },
        { status: 429 }
      );
    }

    // Site-wide burst ceiling: a real visitor never needs this many codes.
    try {
      const windowStart = new Date(Date.now() - LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
      const recent = await admin.entities.RequestVerification.count({ created_date: { $gt: windowStart } });
      if (recent >= WINDOW_LIMIT) {
        return Response.json(
          { error: "Too many verification requests right now. Please try again in a few minutes." },
          { status: 429 }
        );
      }
    } catch {
      // A failed count must never block a genuine request.
    }

    await admin.entities.RequestVerification.deleteMany({ email });

    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    const code = String(100000 + (random[0] % 900000));
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();

    await admin.entities.RequestVerification.create({ email, code, expiresAt, attempts: 0, verified: false });

    const greeting = name ? `Hi ${name},` : "Hello,";
    // A delivery failure must read as a friendly message, never as the mail
    // provider's internal wording.
    let mail;
    try {
      mail = await admin.integrations.Core.SendEmail({
      to: email,
      subject: "Your Family Care Workforce verification code",
      category: "transactional",
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#f7f7f8;padding:24px">
          <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb">
            <div style="background:#0a2547;padding:20px 28px">
              <img src="https://media.base44.com/images/public/6a50456441d8a4a42f7c8722/6641ab268_logov2.png" alt="Family Care Workforce" style="height:36px;display:block" />
            </div>
            <div style="padding:28px;color:#0a2547">
              <h2 style="margin:0 0 12px;font-size:20px">Verify your email address</h2>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6">${greeting}</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6">Use the code below to confirm your email and submit your care request. It expires in ${CODE_TTL_MINUTES} minutes.</p>
              <div style="font-size:32px;letter-spacing:10px;font-weight:bold;background:#f7f7f8;border:1px solid #e5e7eb;padding:18px;text-align:center">${code}</div>
              <p style="margin:20px 0 0;font-size:13px;color:#0a2547">If you did not request this, you can ignore this email.</p>
            </div>
            <div style="background:#0a2547;color:#ffffff;padding:14px 28px;font-size:12px">Family Care Workforce Solutions</div>
          </div>
        </div>
      `,
        text: `${greeting}\n\nYour Family Care Workforce verification code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes.\n\nIf you did not request this, you can ignore this email.`,
      });
    } catch {
      return Response.json(
        { error: "We couldn't send the code right now. Please try again in a moment." },
        { status: 502 }
      );
    }

    if (mail && mail.success === false) {
      return Response.json(
        { error: "We couldn't deliver a code to that address. Please check it and try again." },
        { status: 502 }
      );
    }

    return Response.json({ success: true, email, expiresInMinutes: CODE_TTL_MINUTES });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
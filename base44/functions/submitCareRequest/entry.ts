import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { sendOrgNotification, emailShell } from "../../shared/resend.ts";

// Only accepts a care request after the visitor proved they own the email
// address: a verified, unexpired RequestVerification record must exist for it.
// The record is consumed on success, so one verification = one request.
export default async function (req) {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json().catch(() => ({}));

    const fullName = String(body.fullName || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
    const phone = String(body.phone || "").trim().slice(0, 40);
    const serviceInterest = String(body.serviceInterest || "").trim().slice(0, 120);
    const serviceDateRange = String(body.serviceDateRange || "").trim().slice(0, 40);
    const message = String(body.message || "").trim().slice(0, 4000);

    if (!fullName || !phone) {
      return Response.json({ error: "Please include your name and phone number." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const admin = base44.asServiceRole;

    const { items } = await admin.entities.RequestVerification.filter(
      { email },
      { sort: "-created_date", limit: 1 }
    );
    const verification = items[0];

    if (!verification || !verification.verified) {
      return Response.json(
        { error: "Please verify your email address before sending your request." },
        { status: 403 }
      );
    }
    if (new Date(verification.expiresAt).getTime() < Date.now()) {
      return Response.json(
        { error: "Your verification expired. Please request a new code." },
        { status: 400 }
      );
    }

    const lead = await admin.entities.CareLead.create({
      fullName,
      email,
      phone,
      serviceInterest: serviceInterest || "General inquiry",
      ...(serviceDateRange ? { serviceDateRange } : {}),
      message,
      status: "new",
    });

    await admin.entities.RequestVerification.delete(verification.id);

    await sendOrgNotification({
      subject: `New care request — ${fullName}`,
      replyTo: email,
      html: emailShell(
        "New Care Request",
        [
          ["Name", fullName],
          ["Email", email],
          ["Phone", phone],
          ["Service of interest", serviceInterest || "General inquiry"],
          ["Caregiver service date range", serviceDateRange],
        ],
        message
      ),
      text: `New care request\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nService: ${serviceInterest || "General inquiry"}\nDate range: ${serviceDateRange || "Not specified"}\n\n${message}`,
    }).catch(() => {});

    return Response.json({ success: true, id: lead.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
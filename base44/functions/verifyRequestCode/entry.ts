import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const MAX_ATTEMPTS = 5;

export default async function (req) {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const code = String(body.code || "").trim();

    if (!email || !code) {
      return Response.json({ error: "Enter the code we emailed you." }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const admin = base44.asServiceRole;

    const { items } = await admin.entities.RequestVerification.filter({ email }, { sort: "-created_date", limit: 1 });
    const record = items[0];
    if (!record) {
      return Response.json({ error: "Request a new code to continue." }, { status: 400 });
    }
    if (record.verified) {
      return Response.json({ verified: true });
    }
    if (new Date(record.expiresAt).getTime() < Date.now()) {
      return Response.json({ error: "That code has expired. Please request a new one." }, { status: 400 });
    }
    if ((record.attempts || 0) >= MAX_ATTEMPTS) {
      return Response.json({ error: "Too many attempts. Please request a new code." }, { status: 429 });
    }
    if (record.code !== code) {
      await admin.entities.RequestVerification.update(record.id, { attempts: (record.attempts || 0) + 1 });
      return Response.json({ error: "That code doesn't match. Please check and try again." }, { status: 400 });
    }

    await admin.entities.RequestVerification.update(record.id, { verified: true });
    return Response.json({ verified: true, email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
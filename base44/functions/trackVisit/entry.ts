import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
    const body = await req.json().catch(() => ({}));
    const base44 = createClientFromRequest(req);

    const path = String(body.path || "/").slice(0, 200);
    const page = String(body.page || "Page").slice(0, 100);
    const referrer = String(body.referrer || "").slice(0, 500);
    const userAgent = String(body.userAgent || "").slice(0, 500);
    const sessionId = String(body.sessionId || "").slice(0, 100);
    const locale = String(body.locale || "").slice(0, 20);

    await base44.asServiceRole.entities.Visit.create({
      path,
      page,
      referrer,
      userAgent,
      sessionId,
      locale
    });

    return Response.json({ status: "ok" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
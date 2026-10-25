import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Deliberately public lookup: the reference code saved at submission time IS the
// credential, so no sign-in check is needed. The code is rejected when blank and
// matched exactly, and only the fields the applicant needs are returned.
export default async function(req) {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json().catch(() => ({}));
    const base44 = createClientFromRequest(req);

    const code = String(body.code || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (!code) {
      return Response.json({ applications: [] });
    }

    const matches = await base44.asServiceRole.entities.JobApplication.filter({ lookupCode: code });
    if (!matches || matches.length === 0) {
      return Response.json({ applications: [] });
    }

    const found = matches[0];

    return Response.json({
      applications: [{
        id: found.id,
        lookupCode: found.lookupCode || "",
        position: found.position || "",
        fullName: found.fullName || "",
        email: found.email || "",
        phone: found.phone || "",
        city: found.city || "",
        yearsExperience: found.yearsExperience ?? null,
        experience: found.experience || "",
        status: found.status || "submitted",
        decisionNote: found.decisionNote || "",
        submittedAt: found.created_date
      }]
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
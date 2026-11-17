import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { recordAudit } from "../../shared/audit.ts";

// Records a staff action taken from the dashboard (role changes, hiring
// decisions and the like) so the Audit Log shows who did what.
// Only the people who work in the dashboard write its audit trail. Caregivers
// and families have no audited actions, so their accounts cannot add entries.
const ALLOWED_ROLES = ["admin", "org_manager", "staff"];

export default async function (req) {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!ALLOWED_ROLES.includes(user.role)) {
      return Response.json({ error: "You do not have permission to record activity." }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "").trim().slice(0, 60);
    const description = String(body.description || "").trim().slice(0, 500);
    if (!action || !description) {
      return Response.json({ error: "An action and description are required." }, { status: 400 });
    }

    const stored = await recordAudit(base44, user, { action, description });
    return Response.json({ status: stored ? "ok" : "not_recorded" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
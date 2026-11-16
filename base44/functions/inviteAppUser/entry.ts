import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { sendInviteEmail } from "../../shared/resend.ts";
import { recordAudit } from "../../shared/audit.ts";

const INVITER_ROLES = ["admin", "org_manager", "staff"];

// The role stored on the app's own invite list. An administrator invite is
// recorded as a standard member: admin access is only ever granted from the
// Users tab, never through an invitation.
const INVITEABLE = {
  admin: "user",
  org_manager: "org_manager",
  staff: "staff",
  caregiver: "caregiver",
  onboarding: "onboarding",
  client: "client",
  user: "user",
};

const LABELS = {
  admin: "Administrator",
  org_manager: "Manager",
  staff: "Staff",
  caregiver: "Caregiver",
  onboarding: "Caregiver (onboarding)",
  client: "Client / Family",
  user: "Member",
};

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
    if (!INVITER_ROLES.includes(user.role)) {
      return Response.json({ error: "You do not have permission to send invitations." }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
    const role = String(body.role || "").trim();

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!INVITEABLE[role]) {
      return Response.json({ error: "Unknown role." }, { status: 400 });
    }
    if (role === "admin" && user.role !== "admin") {
      return Response.json({ error: "Only an admin can invite an administrator." }, { status: 403 });
    }

    const intendedRole = INVITEABLE[role];

    // This app keeps its own invitation list. No platform-level user invitation
    // is created, so the invitee only sees the email this app sends.
    const existing = await base44.asServiceRole.entities.PendingInvite.filter({ email });
    if (existing && existing.length > 0) {
      await base44.asServiceRole.entities.PendingInvite.update(existing[0].id, { intendedRole });
    } else {
      await base44.asServiceRole.entities.PendingInvite.create({ email, intendedRole });
    }

    const origin = (req.headers.get("X-Base44-App-Url") || "https://familycareworkforce.base44.app").replace(/\/$/, "");
    const registerUrl = `${origin}/register`;

    let emailSent = false;
    let emailError = null;
    try {
      await sendInviteEmail({ to: email, roleLabel: LABELS[role], registerUrl });
      emailSent = true;
    } catch (error) {
      emailError = error.message;
    }

    await recordAudit(base44, user, {
      action: "invitation.sent",
      description: `Invited ${email} as ${LABELS[role]}${emailSent ? "" : " (invite saved, email not delivered)"}`,
    });

    return Response.json({
      status: "invited",
      email,
      intendedRole,
      roleLabel: LABELS[role],
      emailSent,
      emailError,
      registerUrl,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
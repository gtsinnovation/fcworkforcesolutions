import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = String(user.email || "").toLowerCase().trim();
    if (!email) {
      return Response.json({ error: "No email on user" }, { status: 400 });
    }

    // Only standard platform users are candidates for an auto-upgrade.
    // Admins and already-assigned custom roles are left untouched.
    if (user.role && user.role !== "user") {
      return Response.json({ status: "already_assigned", role: user.role });
    }

    // Look up a pending invite an admin recorded for this email.
    const pending = await base44.asServiceRole.entities.PendingInvite.filter({ email });
    if (!pending || pending.length === 0) {
      return Response.json({ status: "no_pending_invite" });
    }

    const invite = pending[0];
    const intendedRole = invite.intendedRole;

    // Apply the intended role to the current user (service role is required to set User.role).
    await base44.asServiceRole.entities.User.update(user.id, { role: intendedRole });
    await base44.asServiceRole.entities.PendingInvite.delete(invite.id);

    return Response.json({ status: "upgraded", role: intendedRole, email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
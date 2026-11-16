// Single place where the app's audit history is written.
// A failed write never breaks the action that triggered it.
export async function recordAudit(base44, user, { action, description }) {
  try {
    await base44.asServiceRole.entities.AuditLog.create({
      userId: user?.id || "",
      userEmail: user?.email || "",
      role: user?.role || "",
      action: String(action || "activity").slice(0, 60),
      description: String(description || "").slice(0, 500),
    });
    return true;
  } catch {
    return false;
  }
}
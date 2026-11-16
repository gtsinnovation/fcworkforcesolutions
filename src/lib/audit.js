import { base44 } from "@/api/base44Client";

// Best effort: an audit entry never blocks the action that triggered it.
export async function logAudit(action, description) {
  try {
    await base44.functions.invoke("recordAuditEvent", { action, description });
  } catch (err) {
    console.error("Audit log failed", err);
  }
}
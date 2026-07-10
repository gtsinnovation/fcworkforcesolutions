import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Loader2 } from "lucide-react";

export default function AuditTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.AuditLog.list("-created_date", 50).then(data => { setLogs(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-xl text-primary">Audit Log</h2>
        <p className="text-sm text-muted-foreground">System activity history (last 50 entries)</p>
      </div>

      <div className="care-card overflow-x-auto">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No audit entries yet.</p>
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-medium">{log.action}</span></td>
                  <td className="px-4 py-3 text-foreground">{log.description}</td>
                  <td className="px-4 py-3 text-muted-foreground">{log.userEmail || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{log.role || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(log.created_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
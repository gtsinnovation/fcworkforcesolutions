import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Loader2, ChevronDown, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/fcws/admin/Pagination";

const PAGE_SIZE = 25;

export default function AuditTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    base44.entities.AuditLog.list("-created_date", 200).then(data => { setLogs(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));
  const pagedLogs = logs.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-xl text-primary">Audit Log</h2>
        <p className="text-sm text-muted-foreground">System activity history ({logs.length} entries)</p>
      </div>

      <div className="care-card overflow-x-auto p-0">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No audit entries yet.</p>
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border bg-muted/30">
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 hidden md:table-cell">User</th>
                <th className="px-4 py-3 hidden lg:table-cell">Role</th>
                <th className="px-4 py-3 hidden sm:table-cell">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {pagedLogs.map(log => {
                const isExpanded = expandedId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : log.id)}>
                      <td className="px-4 py-3"><ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} /></td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-medium">{log.action}</span></td>
                      <td className="px-4 py-3 text-foreground max-w-md truncate">{log.description}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{log.userEmail || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{log.role || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap hidden sm:table-cell">{new Date(log.created_date).toLocaleString()}</td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-muted/20">
                        <td colSpan={6} className="px-8 py-4">
                          <div className="grid gap-4 sm:grid-cols-2 text-sm">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Log ID</p>
                              <p className="text-foreground break-all">{log.id}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">User ID</p>
                              <p className="text-foreground break-all flex items-center gap-1"><User className="w-3.5 h-3.5 text-secondary" /> {log.userId || "—"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Timestamp</p>
                              <p className="text-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-secondary" /> {new Date(log.created_date).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Role</p>
                              <p className="text-foreground">{log.role || "—"}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Full Description</p>
                              <p className="text-foreground whitespace-pre-wrap p-3 rounded-lg bg-background border border-border">{log.description}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={logs.length} pageSize={PAGE_SIZE} />
    </div>
  );
}
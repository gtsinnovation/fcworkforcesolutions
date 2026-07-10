import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { AlertTriangle, Loader2, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEVERITY_LABELS } from "@/lib/fcws";
import { cn } from "@/lib/utils";

export default function IncidentsTab() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    base44.entities.IncidentReport.list("-created_date").then(data => { setIncidents(data); setLoading(false); }).catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function markRead(id) {
    await base44.entities.IncidentReport.update(id, { read: true });
    load();
  }

  async function markAllRead() {
    const unread = incidents.filter(i => !i.read);
    for (const inc of unread) {
      await base44.entities.IncidentReport.update(inc.id, { read: true });
    }
    load();
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  const unreadCount = incidents.filter(i => !i.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl text-primary">Incident Reports</h2>
          <p className="text-sm text-muted-foreground">{incidents.length} total · {unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead}><Check className="w-4 h-4 mr-1" /> Mark all read</Button>
        )}
      </div>

      <div className="space-y-3">
        {incidents.length === 0 ? (
          <div className="care-card text-center py-12">
            <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No incident reports filed.</p>
          </div>
        ) : incidents.map(inc => {
          const sev = SEVERITY_LABELS[inc.severity] || SEVERITY_LABELS.Low;
          return (
            <div key={inc.id} className={cn("care-card", !inc.read && "border-l-4 border-l-secondary")}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", sev.color)}>{sev.label}</span>
                    {!inc.read && <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">New</span>}
                    <span className="text-xs text-muted-foreground">{new Date(inc.created_date).toLocaleString()}</span>
                  </div>
                  <h3 className="font-semibold text-primary mb-1">{inc.clientName}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Incident date: {inc.incidentDateTime} · Reported by: {inc.reportedByName || "Unknown"}
                  </p>
                  <p className="text-sm text-foreground mb-2">{inc.narrative}</p>
                  {inc.resolutionSteps && (
                    <div className="mt-2 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Resolution:</p>
                      <p className="text-sm text-foreground">{inc.resolutionSteps}</p>
                    </div>
                  )}
                </div>
                {!inc.read && (
                  <Button size="sm" variant="ghost" onClick={() => markRead(inc.id)} className="shrink-0">
                    <Clock className="w-4 h-4 mr-1" /> Mark read
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Briefcase, CalendarDays, AlertTriangle, TrendingUp, Clock } from "lucide-react";

export default function OverviewTab() {
  const [stats, setStats] = useState({ employees: 0, clients: 0, schedules: 0, incidents: 0, pendingIncidents: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Employee.list(),
      base44.entities.Client.list(),
      base44.entities.ScheduleEntry.list(),
      base44.entities.IncidentReport.list(),
      base44.entities.AuditLog.list("-created_date", 10),
    ]).then(([employees, clients, schedules, incidents, logs]) => {
      setStats({
        employees: employees.length,
        clients: clients.length,
        schedules: schedules.length,
        incidents: incidents.length,
        pendingIncidents: incidents.filter(i => !i.read).length,
      });
      setRecentActivity(logs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Caregivers", value: stats.employees, icon: Briefcase, color: "text-secondary bg-secondary/10" },
    { label: "Active Clients", value: stats.clients, icon: Users, color: "text-blue-600 bg-blue-100" },
    { label: "Scheduled Visits", value: stats.schedules, icon: CalendarDays, color: "text-accent-foreground bg-accent" },
    { label: "Incident Reports", value: stats.incidents, icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
  ];

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="care-card">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="font-heading font-bold text-3xl text-primary">{card.value}</div>
              <div className="text-sm text-muted-foreground">{card.label}</div>
            </div>
          );
        })}
      </div>

      {stats.pendingIncidents > 0 && (
        <div className="care-card border-l-4 border-l-destructive flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <p className="text-sm font-medium text-foreground">
            {stats.pendingIncidents} unread incident report{stats.pendingIncidents !== 1 ? "s" : ""} need{stats.pendingIncidents === 1 ? "s" : ""} attention.
          </p>
        </div>
      )}

      <div className="care-card">
        <h3 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-secondary" /> Recent Activity
        </h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map(log => (
              <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{log.description}</p>
                  <p className="text-xs text-muted-foreground">{log.action} · {log.userEmail || "system"} · {new Date(log.created_date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
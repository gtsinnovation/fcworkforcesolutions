import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarDays, Clock, Users, AlertTriangle, Phone, Loader2 } from "lucide-react";
import { SERVICE_CATALOG } from "@/lib/fcws";

export default function ClientPortal() {
  const [user, setUser] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [clients, setClients] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
    Promise.all([
      base44.entities.ScheduleEntry.list(),
      base44.entities.Client.list(),
      base44.entities.IncidentReport.list("-created_date", 5),
    ]).then(([sched, clts, incs]) => {
      setSchedules(sched);
      setClients(clts);
      setIncidents(incs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todaySchedule = schedules.filter(s => s.date === today);
  const upcoming = schedules.filter(s => s.date > today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const clientMap = Object.fromEntries(clients.map(c => [c.id, c]));
  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-primary">Family Portal</h1>
        <p className="text-sm text-muted-foreground">Welcome, {user?.full_name || user?.email}</p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="care-card">
          <div className="flex items-center gap-3 mb-2"><CalendarDays className="w-5 h-5 text-secondary" /><span className="text-sm text-muted-foreground">Today's Visit</span></div>
          <div className="font-heading font-bold text-2xl text-primary">{todaySchedule.length}</div>
        </div>
        <div className="care-card">
          <div className="flex items-center gap-3 mb-2"><Clock className="w-5 h-5 text-secondary" /><span className="text-sm text-muted-foreground">Upcoming</span></div>
          <div className="font-heading font-bold text-2xl text-primary">{upcoming.length}</div>
        </div>
        <div className="care-card">
          <div className="flex items-center gap-3 mb-2"><Users className="w-5 h-5 text-secondary" /><span className="text-sm text-muted-foreground">Care Team</span></div>
          <div className="font-heading font-bold text-2xl text-primary">{clients.length}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's care */}
        <div className="care-card">
          <h3 className="font-heading font-semibold text-lg text-primary mb-4">Today's Care</h3>
          {todaySchedule.length === 0 ? (
            <p className="text-sm text-muted-foreground">No care visits scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map(s => (
                <div key={s.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="font-semibold text-sm text-primary">{s.startTime}–{s.endTime}</p>
                  <p className="text-sm text-muted-foreground">{SERVICE_CATALOG.find(sv => sv.slug === s.service)?.title || s.service}</p>
                  {s.notes && <p className="text-xs text-muted-foreground mt-1">{s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="care-card">
          <h3 className="font-heading font-semibold text-lg text-primary mb-4">Upcoming Visits</h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming visits scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map(s => (
                <div key={s.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="font-semibold text-sm text-primary">{new Date(s.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                  <p className="text-sm text-muted-foreground">{s.startTime}–{s.endTime} · {SERVICE_CATALOG.find(sv => sv.slug === s.service)?.title || s.service}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact / Emergency */}
      <div className="care-card mt-6 bg-primary text-primary-foreground">
        <h3 className="font-heading font-semibold text-lg mb-3">Need Help?</h3>
        <p className="text-sm text-primary-foreground/80 mb-4">If you have an urgent concern about your loved one's care, don't hesitate to reach out.</p>
        <div className="flex flex-wrap gap-3">
          <a href="tel:+231888988796" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            <Phone className="w-4 h-4" /> Call Care Office
          </a>
        </div>
      </div>

      {/* Recent incident notifications */}
      {incidents.length > 0 && (
        <div className="care-card mt-6">
          <h3 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-secondary" /> Recent Notifications
          </h3>
          <div className="space-y-2">
            {incidents.slice(0, 3).map(inc => (
              <div key={inc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground flex-1">Regarding: {inc.clientName}</span>
                <span className="text-xs text-muted-foreground">{new Date(inc.created_date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
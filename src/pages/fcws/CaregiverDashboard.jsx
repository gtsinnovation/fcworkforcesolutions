import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarDays, Clock, Users, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_CATALOG, SEVERITY_LABELS } from "@/lib/fcws";

export default function CaregiverDashboard() {
  const [user, setUser] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [clients, setClients] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
    Promise.all([
      base44.entities.ScheduleEntry.list(),
      base44.entities.Client.list(),
      base44.entities.IncidentReport.filter({ reportedByUserId: user?.id || "temp" }),
    ]).then(([sched, clts, incs]) => {
      setSchedules(sched);
      setClients(clts);
      setIncidents(incs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todaySchedule = schedules.filter(s => s.date === today);
  const upcomingSchedule = schedules.filter(s => s.date > today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const clientMap = Object.fromEntries(clients.map(c => [c.id, c]));

  async function handleIncidentSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await base44.entities.IncidentReport.create({
        reportedByUserId: user?.id || "",
        reportedByName: user?.full_name || user?.email || "",
        clientName: formData.get("clientName"),
        incidentDateTime: formData.get("incidentDateTime"),
        narrative: formData.get("narrative"),
        severity: formData.get("severity") || "Low",
        resolutionSteps: formData.get("resolutionSteps") || "",
        read: false,
      });
      form.reset();
      setShowIncidentForm(false);
      // Reload incidents
      const incs = await base44.entities.IncidentReport.filter({ reportedByUserId: user?.id || "temp" });
      setIncidents(incs);
    } catch (err) {
      setError(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-primary">Caregiver Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome, {user?.full_name || user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="care-card">
          <div className="flex items-center gap-3 mb-2"><CalendarDays className="w-5 h-5 text-secondary" /><span className="text-sm text-muted-foreground">Today's Visits</span></div>
          <div className="font-heading font-bold text-2xl text-primary">{todaySchedule.length}</div>
        </div>
        <div className="care-card">
          <div className="flex items-center gap-3 mb-2"><Clock className="w-5 h-5 text-secondary" /><span className="text-sm text-muted-foreground">Upcoming</span></div>
          <div className="font-heading font-bold text-2xl text-primary">{upcomingSchedule.length}</div>
        </div>
        <div className="care-card">
          <div className="flex items-center gap-3 mb-2"><FileText className="w-5 h-5 text-secondary" /><span className="text-sm text-muted-foreground">Reports Filed</span></div>
          <div className="font-heading font-bold text-2xl text-primary">{incidents.length}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's schedule */}
        <div className="care-card">
          <h3 className="font-heading font-semibold text-lg text-primary mb-4">Today's Schedule</h3>
          {todaySchedule.length === 0 ? (
            <p className="text-sm text-muted-foreground">No visits scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map(s => (
                <div key={s.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="font-semibold text-sm text-primary">{clientMap[s.clientId]?.fullName || "Client"}</p>
                  <p className="text-sm text-muted-foreground">{s.startTime}–{s.endTime}</p>
                  <p className="text-xs text-secondary font-medium mt-1">{SERVICE_CATALOG.find(sv => sv.slug === s.service)?.title || s.service}</p>
                  {s.notes && <p className="text-xs text-muted-foreground mt-1">{s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="care-card">
          <h3 className="font-heading font-semibold text-lg text-primary mb-4">Upcoming Visits</h3>
          {upcomingSchedule.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming visits scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcomingSchedule.map(s => (
                <div key={s.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="font-semibold text-sm text-primary">{clientMap[s.clientId]?.fullName || "Client"}</p>
                  <p className="text-sm text-muted-foreground">{new Date(s.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {s.startTime}–{s.endTime}</p>
                  <p className="text-xs text-secondary font-medium mt-1">{SERVICE_CATALOG.find(sv => sv.slug === s.service)?.title || s.service}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* File incident report */}
      <div className="care-card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-secondary" /> File an Incident Report
          </h3>
          <Button variant="outline" onClick={() => setShowIncidentForm(!showIncidentForm)}>
            {showIncidentForm ? "Cancel" : "New Report"}
          </Button>
        </div>

        {showIncidentForm && (
          <form onSubmit={handleIncidentSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Select name="clientName" required>
                  <SelectTrigger id="clientName"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.fullName}>{c.fullName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentDateTime">Date & Time of Incident *</Label>
                <Input id="incidentDateTime" name="incidentDateTime" type="datetime-local" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select name="severity" defaultValue="Low">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SEVERITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="narrative">What Happened? *</Label>
              <Textarea id="narrative" name="narrative" rows={4} required placeholder="Describe the incident in detail..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resolutionSteps">Resolution / Action Taken</Label>
              <Textarea id="resolutionSteps" name="resolutionSteps" rows={3} placeholder="What did you do to resolve or address the situation?" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {submitting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Submit Report
            </Button>
          </form>
        )}

        {!showIncidentForm && incidents.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">Your Recent Reports:</p>
            {incidents.slice(0, 5).map(inc => {
              const sev = SEVERITY_LABELS[inc.severity] || SEVERITY_LABELS.Low;
              return (
                <div key={inc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sev.color}`}>{sev.label}</span>
                  <span className="text-sm text-foreground flex-1 truncate">{inc.clientName}: {inc.narrative}</span>
                  <span className="text-xs text-muted-foreground">{new Date(inc.created_date).toLocaleDateString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
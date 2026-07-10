import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Loader2, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_CATALOG } from "@/lib/fcws";
import { cn } from "@/lib/utils";

function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function daysInMonth(date) { return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); }
function toDateStr(y, m, d) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

export default function SchedulingTab() {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function load() {
    Promise.all([
      base44.entities.ScheduleEntry.list(),
      base44.entities.Client.list(),
      base44.entities.Employee.list(),
    ]).then(([sched, clts, emps]) => {
      setSchedules(sched);
      setClients(clts);
      setEmployees(emps);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const approvedEmployees = employees.filter(e => e.hiringStatus === "approved" && e.active);
  const totalDays = daysInMonth(cursor);
  const firstWeekday = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();

  const schedulesByDate = useMemo(() => {
    const map = {};
    schedules.forEach(s => { (map[s.date] = map[s.date] || []).push(s); });
    return map;
  }, [schedules]);

  const clientMap = useMemo(() => Object.fromEntries(clients.map(c => [c.id, c])), [clients]);
  const employeeMap = useMemo(() => Object.fromEntries(employees.map(e => [e.id, e])), [employees]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await base44.entities.ScheduleEntry.create({
        clientId: formData.get("clientId"),
        employeeId: formData.get("employeeId"),
        service: formData.get("service"),
        date: selectedDate,
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime"),
        notes: formData.get("notes") || "",
      });
      form.reset();
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message || "Failed to create schedule");
    } finally {
      setSubmitting(false);
    }
  }

  function prevMonth() { setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)); }
  function nextMonth() { setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)); }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl text-primary">Scheduling</h2>
          <p className="text-sm text-muted-foreground">{schedules.length} total assignments</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Plus className="w-4 h-4 mr-1" /> New Assignment
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Calendar */}
        <div className="care-card">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="w-5 h-5" /></Button>
            <h3 className="font-heading font-semibold text-primary">{cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
            <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="w-5 h-5" /></Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }).map((_, i) => <div key={`pad-${i}`} />)}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const dateStr = toDateStr(cursor.getFullYear(), cursor.getMonth(), day);
              const count = schedulesByDate[dateStr]?.length || 0;
              const selected = dateStr === selectedDate;
              return (
                <button key={dateStr} onClick={() => setSelectedDate(dateStr)}
                  className={cn("relative aspect-square rounded-lg text-sm transition-colors",
                    selected ? "bg-primary text-primary-foreground" :
                    count > 0 ? "bg-secondary/15 text-primary" : "text-muted-foreground hover:bg-muted")}>
                  {day}
                  {count > 0 && <span className={cn("absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full", selected ? "bg-secondary" : "bg-secondary")} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visits on selected date */}
        <div className="care-card">
          <h3 className="font-heading font-semibold text-primary mb-4">Visits on {selectedDate}</h3>
          {(schedulesByDate[selectedDate] || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No visits scheduled for this date.</p>
          ) : (
            <div className="space-y-3">
              {(schedulesByDate[selectedDate] || []).map(s => (
                <div key={s.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="font-semibold text-sm text-primary">
                    {clientMap[s.clientId]?.fullName || "Unknown client"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employeeMap[s.employeeId]?.fullName || "Unassigned"} · {s.startTime}–{s.endTime}
                  </p>
                  <p className="text-xs text-secondary font-medium mt-1">
                    {SERVICE_CATALOG.find(sv => sv.slug === s.service)?.title || s.service}
                  </p>
                  {s.notes && <p className="text-xs text-muted-foreground mt-1">{s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="care-card space-y-5">
          <p className="text-sm font-medium text-primary">Assigning for: <span className="font-bold">{selectedDate}</span></p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select name="clientId" required>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Caregiver</Label>
              <Select name="employeeId" required>
                <SelectTrigger><SelectValue placeholder="Select caregiver" /></SelectTrigger>
                <SelectContent>{approvedEmployees.map(e => <SelectItem key={e.id} value={e.id}>{e.fullName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Service</Label>
              <Select name="service" required>
                <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent>{SERVICE_CATALOG.map(s => <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label htmlFor="startTime">Start Time</Label><Input id="startTime" name="startTime" type="time" required /></div>
            <div className="space-y-2"><Label htmlFor="endTime">End Time</Label><Input id="endTime" name="endTime" type="time" required /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" rows={2} placeholder="Special instructions..." /></div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {submitting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Confirm Assignment
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}
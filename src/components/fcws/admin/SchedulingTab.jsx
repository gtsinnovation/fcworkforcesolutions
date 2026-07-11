import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Loader2, CalendarDays, ChevronLeft, ChevronRight, Trash2, Clock, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_CATALOG } from "@/lib/fcws";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatWeekRange(weekStart) {
  const end = addDays(weekStart, 6);
  const sameMonth = weekStart.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${weekStart.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${end.getFullYear()}`;
}

export default function SchedulingTab() {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(toDateStr(new Date()));
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
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

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(weekStart, i);
      const ds = toDateStr(d);
      return { date: d, dateStr: ds, entries: schedules.filter(s => s.date === ds).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || "")) };
    });
  }, [weekStart, schedules]);

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

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await base44.entities.ScheduleEntry.delete(id);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  function prevWeek() { setWeekStart(addDays(weekStart, -7)); }
  function nextWeek() { setWeekStart(addDays(weekStart, 7)); }
  function goToday() { const d = startOfWeek(new Date()); setWeekStart(d); }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  const todayStr = toDateStr(new Date());
  const weekEntryCount = weekDays.reduce((sum, d) => sum + d.entries.length, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl text-primary">Shift Calendar</h2>
          <p className="text-sm text-muted-foreground">{weekEntryCount} shifts this week · {schedules.length} total assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToday}>Today</Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={prevWeek}><ChevronLeft className="w-5 h-5" /></Button>
            <span className="text-sm font-semibold text-primary min-w-[180px] text-center">{formatWeekRange(weekStart)}</span>
            <Button variant="ghost" size="icon" onClick={nextWeek}><ChevronRight className="w-5 h-5" /></Button>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Plus className="w-4 h-4 mr-1" /> New Shift
          </Button>
        </div>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-6">
        {weekDays.map(({ date, dateStr, entries }) => {
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          return (
            <div key={dateStr} className={cn("rounded-xl border flex flex-col min-h-[200px]", isToday ? "border-secondary bg-secondary/5" : "border-border bg-card")}>
              {/* Day header */}
              <button
                onClick={() => { setSelectedDate(dateStr); setShowForm(false); }}
                className={cn(
                  "px-3 py-2.5 text-left border-b transition-colors rounded-t-xl",
                  isSelected ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide">{WEEKDAYS[date.getDay()]}</span>
                  <span className={cn("text-sm font-bold", isSelected ? "text-primary-foreground" : isToday ? "text-secondary" : "text-primary")}>{date.getDate()}</span>
                </div>
              </button>
              {/* Shifts */}
              <div className="p-2 space-y-2 flex-1">
                {entries.length === 0 ? (
                  <button
                    onClick={() => { setSelectedDate(dateStr); setShowForm(true); }}
                    className="w-full text-xs text-muted-foreground/60 hover:text-secondary hover:bg-secondary/5 rounded-lg py-6 transition-colors"
                  >
                    + Add shift
                  </button>
                ) : entries.map(s => (
                  <div key={s.id} className={cn("group rounded-lg p-2 text-xs border", isToday ? "bg-secondary/10 border-secondary/30" : "bg-muted/40 border-border")}>
                    <div className="flex items-start justify-between gap-1">
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <Clock className="w-3 h-3 text-secondary" />
                        {s.startTime}–{s.endTime}
                      </span>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        className="opacity-0 group-hover:opacity-100 text-destructive/60 hover:text-destructive transition-all"
                      >
                        {deletingId === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="font-medium text-foreground mt-1 truncate">{clientMap[s.clientId]?.fullName || "Unknown client"}</p>
                    <p className="text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                      <UserCircle className="w-3 h-3" /> {employeeMap[s.employeeId]?.fullName || "Unassigned"}
                    </p>
                    <p className="text-secondary font-medium mt-1 truncate">
                      {SERVICE_CATALOG.find(sv => sv.slug === s.service)?.title.split(" ")[0] || s.service}
                    </p>
                    {s.notes && <p className="text-muted-foreground mt-1 line-clamp-2 italic">{s.notes}</p>}
                  </div>
                ))}
                <button
                  onClick={() => { setSelectedDate(dateStr); setShowForm(true); }}
                  className="w-full text-xs text-muted-foreground/60 hover:text-secondary hover:bg-secondary/5 rounded-lg py-1.5 transition-colors border border-dashed border-transparent hover:border-secondary/30"
                >
                  + Add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Shift Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="care-card space-y-5">
          <p className="text-sm font-medium text-primary">New Shift for: <span className="font-bold text-secondary">{selectedDate}</span></p>
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
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes-day">Start / End Time</Label>
              <div className="flex items-center gap-2">
                <Input id="startTime" name="startTime" type="time" required />
                <span className="text-muted-foreground">–</span>
                <Input id="endTime" name="endTime" type="time" required />
              </div>
            </div>
          </div>
          <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" rows={2} placeholder="Special instructions..." /></div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {submitting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Confirm Shift
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}
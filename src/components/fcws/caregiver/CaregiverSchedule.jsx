import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarDays, Clock, Loader2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SERVICE_CATALOG } from "@/lib/fcws";

export default function CaregiverSchedule({ schedules, clientMap, onSchedulesChange }) {
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const todaySchedule = schedules.filter(s => s.date === today);
  const upcoming = schedules.filter(s => s.date > today).sort((a, b) => a.date.localeCompare(b.date));

  function startEdit(s) {
    setEditingId(s.id);
    setEditNotes(s.notes || "");
  }

  async function saveEdit(id) {
    setSaving(true);
    try {
      await base44.entities.ScheduleEntry.update(id, { notes: editNotes });
      setEditingId(null);
      onSchedulesChange();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function renderEntry(s) {
    const isToday = s.date === today;
    return (
      <div key={s.id} className="p-3 rounded-lg bg-muted/50 border border-border">
        <p className="font-semibold text-sm text-primary">{clientMap[s.clientId]?.fullName || "Client"}</p>
        <p className="text-sm text-muted-foreground">
          {isToday ? "Today" : new Date(s.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {s.startTime}–{s.endTime}
        </p>
        <p className="text-xs text-secondary font-medium mt-1">{SERVICE_CATALOG.find(sv => sv.slug === s.service)?.title || s.service}</p>
        {editingId === s.id ? (
          <div className="mt-2 space-y-2">
            <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} placeholder="Add visit notes..." />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => saveEdit(s.id)} disabled={saving} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Check className="w-3 h-3 mr-1" />} Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-3 h-3 mr-1" /> Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-start justify-between gap-2">
            <p className="text-xs text-muted-foreground flex-1">{s.notes || "No notes yet"}</p>
            <button onClick={() => startEdit(s)} className="text-secondary hover:text-secondary/80 shrink-0">
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="care-card">
        <h3 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-secondary" /> Today's Schedule
        </h3>
        {todaySchedule.length === 0 ? (
          <p className="text-sm text-muted-foreground">No visits scheduled for today.</p>
        ) : (
          <div className="space-y-3">{todaySchedule.map(renderEntry)}</div>
        )}
      </div>
      <div className="care-card">
        <h3 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-secondary" /> Upcoming Visits
        </h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming visits scheduled.</p>
        ) : (
          <div className="space-y-3">{upcoming.slice(0, 10).map(renderEntry)}</div>
        )}
      </div>
    </>
  );
}
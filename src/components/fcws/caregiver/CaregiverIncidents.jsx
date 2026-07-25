import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { AlertTriangle, Loader2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEVERITY_LABELS } from "@/lib/fcws";

export default function CaregiverIncidents({ user, clients, incidents, onIncidentsChange }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editResolution, setEditResolution] = useState("");
  const [editNarrative, setEditNarrative] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
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
      setShowForm(false);
      onIncidentsChange();
    } catch (err) {
      setError(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveEdit(id) {
    setSaving(true);
    try {
      await base44.entities.IncidentReport.update(id, {
        resolutionSteps: editResolution,
        narrative: editNarrative,
      });
      setEditingId(null);
      onIncidentsChange();
    } catch (err) {
      setError(err.message || "Failed to update report");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="care-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-secondary" /> Incident Reports
        </h3>
        <Button variant="outline" size="sm" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          {showForm ? "Cancel" : "New Report"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Client Name *</Label>
              <Select name="clientName" required>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.fullName}>{c.fullName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incidentDateTime">Date & Time *</Label>
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

      {incidents.length === 0 && !showForm ? (
        <p className="text-sm text-muted-foreground">No incident reports filed yet.</p>
      ) : (
        <div className="space-y-2">
          {incidents.map(inc => {
            const sev = SEVERITY_LABELS[inc.severity] || SEVERITY_LABELS.Low;
            return (
              <div key={inc.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sev.color}`}>{sev.label}</span>
                  <span className="text-sm text-foreground flex-1 truncate">{inc.clientName}</span>
                  <span className="text-xs text-muted-foreground">{new Date(inc.created_date).toLocaleDateString()}</span>
                </div>
                {editingId === inc.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea value={editNarrative} onChange={e => setEditNarrative(e.target.value)} rows={3} placeholder="Narrative..." />
                    <Textarea value={editResolution} onChange={e => setEditResolution(e.target.value)} rows={2} placeholder="Resolution / action taken..." />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveEdit(inc.id)} disabled={saving} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Check className="w-3 h-3 mr-1" />} Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-3 h-3 mr-1" /> Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground">{inc.narrative}</p>
                    {inc.resolutionSteps && <p className="text-xs text-muted-foreground mt-1"><span className="font-medium">Resolution:</span> {inc.resolutionSteps}</p>}
                    <button onClick={() => { setEditingId(inc.id); setEditNarrative(inc.narrative || ""); setEditResolution(inc.resolutionSteps || ""); }} className="text-secondary text-xs mt-1 flex items-center gap-1 hover:underline">
                      <Pencil className="w-3 h-3" /> Update
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
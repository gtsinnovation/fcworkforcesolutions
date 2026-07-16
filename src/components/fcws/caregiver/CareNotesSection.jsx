import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Loader2, StickyNote, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CareNotesSection({ clients, employeeId, notes, onNotesChange }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [noteText, setNoteText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedClient || !noteText.trim()) return;
    setSubmitting(true);
    setError("");
    const client = clients.find(c => c.id === selectedClient);
    try {
      await base44.entities.CareNote.create({
        clientId: selectedClient,
        clientName: client?.fullName || "",
        employeeId: employeeId || "",
        note: noteText.trim(),
      });
      setNoteText("");
      setSelectedClient("");
      setShowForm(false);
      onNotesChange();
    } catch (err) {
      setError(err.message || "Failed to save note");
    } finally {
      setSubmitting(false);
    }
  }

  if (clients.length === 0) {
    return (
      <div className="care-card">
        <h3 className="font-heading font-semibold text-lg text-primary mb-2 flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-secondary" /> Care Notes
        </h3>
        <p className="text-sm text-muted-foreground">No assigned clients yet. Care notes become available once you have scheduled visits.</p>
      </div>
    );
  }

  return (
    <div className="care-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-secondary" /> Care Notes
        </h3>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : <><Plus className="w-4 h-4 mr-1" /> Add Note</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Client</label>
            <Select value={selectedClient} onValueChange={setSelectedClient} required>
              <SelectTrigger><SelectValue placeholder="Select assigned client" /></SelectTrigger>
              <SelectContent>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Note</label>
            <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} required placeholder="Observations, updates, or care details..." />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            {submitting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Save Note
          </Button>
        </form>
      )}

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No care notes recorded yet.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {notes.map(n => (
            <div key={n.id} className="p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-primary">{n.clientName || "Client"}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(n.created_date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-foreground">{n.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Loader2, Users, Mail, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_CATALOG } from "@/lib/fcws";

export default function ClientsTab() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function load() {
    base44.entities.Client.list().then(data => { setClients(data); setLoading(false); }).catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const services = formData.getAll("services");
      await base44.entities.Client.create({
        fullName: formData.get("fullName"),
        emergencyContact: {
          name: formData.get("emName"),
          relationship: formData.get("emRelationship"),
          phone: formData.get("emPhone"),
        },
        services,
        scheduleRules: formData.get("scheduleRules") || "",
        billingNotes: formData.get("billingNotes") || "",
      });
      form.reset();
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message || "Failed to add client");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl text-primary">Client Management</h2>
          <p className="text-sm text-muted-foreground">{clients.length} total clients</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Plus className="w-4 h-4 mr-1" /> Add Client
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="care-card mb-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Client Full Name *</Label>
              <Input id="fullName" name="fullName" required placeholder="Robert Johnson" />
            </div>
            <div className="space-y-2">
              <Label>Services Needed</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {SERVICE_CATALOG.map(s => (
                  <label key={s.slug} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="services" value={s.slug} className="rounded border-border" />
                    {s.title}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <h4 className="font-semibold text-sm text-primary mb-3">Emergency Contact</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2"><Label htmlFor="emName">Name</Label><Input id="emName" name="emName" placeholder="Susan Johnson" /></div>
              <div className="space-y-2"><Label htmlFor="emRelationship">Relationship</Label><Input id="emRelationship" name="emRelationship" placeholder="Daughter" /></div>
              <div className="space-y-2"><Label htmlFor="emPhone">Phone</Label><Input id="emPhone" name="emPhone" placeholder="(555) 987-6543" /></div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scheduleRules">Schedule Rules / Preferences</Label>
            <Input id="scheduleRules" name="scheduleRules" placeholder="Mon-Fri 9am-1pm, no weekends" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingNotes">Billing Notes</Label>
            <Textarea id="billingNotes" name="billingNotes" rows={2} placeholder="Private pay, monthly invoicing..." />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {submitting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Save Client
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {clients.length === 0 ? (
          <div className="care-card text-center py-12">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No clients yet. Add your first client to get started.</p>
          </div>
        ) : clients.map(c => (
          <div key={c.id} className="care-card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary mb-1">{c.fullName}</h3>
                {c.emergencyContact && (
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">Emergency:</span> {c.emergencyContact.name} ({c.emergencyContact.relationship}) · {c.emergencyContact.phone}
                  </p>
                )}
                {c.services?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {c.services.map((s, i) => {
                      const svc = SERVICE_CATALOG.find(sv => sv.slug === s);
                      return <span key={i} className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-xs font-medium">{svc?.title || s}</span>;
                    })}
                  </div>
                )}
                {c.scheduleRules && <p className="text-sm text-muted-foreground"><span className="font-medium">Schedule:</span> {c.scheduleRules}</p>}
                {c.billingNotes && <p className="text-sm text-muted-foreground mt-1"><span className="font-medium">Billing:</span> {c.billingNotes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
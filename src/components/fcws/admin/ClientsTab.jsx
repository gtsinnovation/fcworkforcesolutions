import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Loader2, Users, Mail, Phone, Heart, ChevronDown, Calendar, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_CATALOG } from "@/lib/fcws";
import { cn } from "@/lib/utils";
import Pagination from "@/components/fcws/admin/Pagination";
import DeleteButton from "@/components/fcws/admin/DeleteButton";

const PAGE_SIZE = 25;

export default function ClientsTab() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  function load() {
    base44.entities.Client.list().then(data => { setClients(data); setLoading(false); }).catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    await base44.entities.Client.delete(id);
    load();
  }

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

  const totalPages = Math.ceil(clients.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));
  const pagedClients = clients.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

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
        ) : pagedClients.map(c => {
          const isExpanded = expandedId === c.id;
          return (
            <div key={c.id} className="care-card">
              <div className="flex items-start gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary mb-1">{c.fullName}</h3>
                    <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                  </div>
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
                  {c.billingNotes && <p className="text-sm text-muted-foreground mt-1 line-clamp-1"><span className="font-medium">Billing:</span> {c.billingNotes}</p>}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Client ID</p>
                    <p className="text-foreground break-all">{c.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Enrolled</p>
                    <p className="text-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {c.created_date ? new Date(c.created_date).toLocaleDateString() : "—"}</p>
                  </div>
                  {c.emergencyContact && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Emergency Contact</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <p className="flex items-center gap-1 text-foreground"><User className="w-3.5 h-3.5 text-secondary" /> {c.emergencyContact.name || "—"}</p>
                        <p className="flex items-center gap-1 text-foreground"><Heart className="w-3.5 h-3.5 text-secondary" /> {c.emergencyContact.relationship || "—"}</p>
                        <p className="flex items-center gap-1 text-foreground"><Phone className="w-3.5 h-3.5 text-secondary" /> {c.emergencyContact.phone || "—"}</p>
                      </div>
                    </div>
                  )}
                  {c.services?.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Services</p>
                      <ul className="space-y-1">
                        {c.services.map((s, i) => {
                          const svc = SERVICE_CATALOG.find(sv => sv.slug === s);
                          return <li key={i} className="text-foreground"><span className="font-medium text-secondary">{svc?.title || s}</span>{svc && <span className="text-muted-foreground"> — {svc.description}</span>}</li>;
                        })}
                      </ul>
                    </div>
                  )}
                  {c.billingNotes && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Billing Notes</p>
                      <p className="text-foreground">{c.billingNotes}</p>
                    </div>
                  )}
                  {c.scheduleRules && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Schedule Rules</p>
                      <p className="text-foreground">{c.scheduleRules}</p>
                    </div>
                  )}
                  <div className="sm:col-span-2 pt-2 border-t border-border">
                    <DeleteButton label="Delete Client" onDelete={() => handleDelete(c.id)} description="This will permanently delete this client record. This action cannot be undone." />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={clients.length} pageSize={PAGE_SIZE} />
    </div>
  );
}
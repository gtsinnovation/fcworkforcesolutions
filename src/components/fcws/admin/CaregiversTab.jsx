import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Loader2, Briefcase, Mail, Phone, CheckCircle, XCircle, Clock, Eye, ChevronDown, FileText, Calendar, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HIRING_STATUS_LABELS } from "@/lib/fcws";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import Pagination from "@/components/fcws/admin/Pagination";
import DeleteButton from "@/components/fcws/admin/DeleteButton";

const PAGE_SIZE = 25;

export default function CaregiversTab() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [invitingId, setInvitingId] = useState(null);
  const { toast } = useToast();

  function load() {
    base44.entities.Employee.list().then(data => {
      setEmployees(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const specs = formData.get("specializations")?.split(",").map(s => s.trim()).filter(Boolean) || [];
      await base44.entities.Employee.create({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        specializations: specs,
        hiringStatus: "pending",
        active: false,
      });
      form.reset();
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message || "Failed to add caregiver");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    await base44.entities.Employee.delete(id);
    toast({ title: "Caregiver deleted" });
    load();
  }

  async function updateStatus(id, status, active) {
    await base44.entities.Employee.update(id, { hiringStatus: status, active });
    load();
  }

  async function handleInvite(emp) {
    setInvitingId(emp.id);
    try {
      await base44.users.inviteUser(emp.email, "user");
      await base44.entities.PendingInvite.create({ email: emp.email.toLowerCase().trim(), intendedRole: "caregiver" });
      toast({ title: "Invitation sent", description: `An invite was sent to ${emp.email}. Their Caregiver role will be applied automatically when they register and verify their email.` });
    } catch (err) {
      toast({ title: "Failed to invite", description: err.message || "Could not send invitation", variant: "destructive" });
    } finally {
      setInvitingId(null);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  const totalPages = Math.ceil(employees.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));
  const pagedEmployees = employees.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl text-primary">Caregiver Management</h2>
          <p className="text-sm text-muted-foreground">{employees.length} total caregivers</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Plus className="w-4 h-4 mr-1" /> Add Caregiver
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="care-card mb-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" name="fullName" required placeholder="Jane Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="jane@fcws.org" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" required placeholder="(555) 123-4567" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specializations">Specializations (comma-separated)</Label>
            <Input id="specializations" name="specializations" placeholder="Dementia care, personal care, companionship" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {submitting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Save
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {employees.length === 0 ? (
          <div className="care-card text-center py-12">
            <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No caregivers yet. Add your first caregiver to get started.</p>
          </div>
        ) : pagedEmployees.map(emp => {
          const status = HIRING_STATUS_LABELS[emp.hiringStatus] || HIRING_STATUS_LABELS.pending;
          const isExpanded = expandedId === emp.id;
          return (
            <div key={emp.id} className="care-card">
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : emp.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-primary">{emp.fullName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                      {emp.active && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Active</span>}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {emp.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {emp.phone}</span>
                    </div>
                    {emp.specializations?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {emp.specializations.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/admin/caregivers/${emp.id}`}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Link>
                  </Button>
                  {emp.hiringStatus !== "approved" && (
                    <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50" onClick={() => updateStatus(emp.id, "approved", true)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  )}
                  {emp.hiringStatus !== "rejected" && (
                    <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/5" onClick={() => updateStatus(emp.id, "rejected", false)}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  )}
                  {emp.active && (
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(emp.id, emp.hiringStatus, false)}>
                      <Clock className="w-4 h-4 mr-1" /> Deactivate
                    </Button>
                  )}
                  <Button size="sm" variant="outline" disabled={invitingId === emp.id} onClick={() => handleInvite(emp)}>
                    {invitingId === emp.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <UserPlus className="w-4 h-4 mr-1" />} Invite
                  </Button>
                  <DeleteButton label="" onDelete={() => handleDelete(emp.id)} description="This will permanently delete this caregiver record." />
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Employee ID</p>
                    <p className="text-foreground break-all">{emp.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Joined</p>
                    <p className="text-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {emp.created_date ? new Date(emp.created_date).toLocaleDateString() : "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Hiring Status</p>
                    <p className="text-foreground">{status.label} · {emp.active ? "Active" : "Inactive"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Documents</p>
                    {emp.documents?.length > 0 ? (
                      <ul className="space-y-1">{emp.documents.map((d, i) => <li key={i} className="flex items-center gap-1 text-foreground"><FileText className="w-3.5 h-3.5 text-secondary" /> {d}</li>)}</ul>
                    ) : <p className="text-muted-foreground">No documents on file</p>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={employees.length} pageSize={PAGE_SIZE} />
    </div>
  );
}
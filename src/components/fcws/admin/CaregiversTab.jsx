import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Loader2, Briefcase, Mail, Phone, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HIRING_STATUS_LABELS } from "@/lib/fcws";

export default function CaregiversTab() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  async function updateStatus(id, status, active) {
    await base44.entities.Employee.update(id, { hiringStatus: status, active });
    load();
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

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
        ) : employees.map(emp => {
          const status = HIRING_STATUS_LABELS[emp.hiringStatus] || HIRING_STATUS_LABELS.pending;
          return (
            <div key={emp.id} className="care-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              <div className="flex gap-2 flex-shrink-0">
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
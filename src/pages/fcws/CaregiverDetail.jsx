import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Mail, Phone, Briefcase, CheckCircle, XCircle, Clock,
  FileText, ShieldCheck, UserCircle
} from "lucide-react";
import { HIRING_STATUS_LABELS } from "@/lib/fcws";

export default function CaregiverDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    base44.entities.Employee.get(id)
      .then(setEmployee)
      .catch(() => setEmployee(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status, active) {
    setUpdating(true);
    try {
      const updated = await base44.entities.Employee.update(id, { hiringStatus: status, active });
      setEmployee(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Caregiver not found.</p>
        <Button asChild variant="outline">
          <Link to="/admin?tab=caregivers">Back to Caregivers</Link>
        </Button>
      </div>
    );
  }

  const status = HIRING_STATUS_LABELS[employee.hiringStatus] || HIRING_STATUS_LABELS.pending;

  return (
    <div>
      <Link to="/admin?tab=caregivers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Caregivers
      </Link>

      {/* Header card */}
      <div className="care-card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <UserCircle className="w-9 h-9 text-secondary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-heading font-bold text-2xl text-primary">{employee.fullName}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
              {employee.active && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Active</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Caregiver Profile</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="care-card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-secondary" /> Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <a href={`mailto:${employee.email}`} className="text-sm text-primary hover:text-secondary transition-colors">{employee.email}</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <a href={`tel:${employee.phone}`} className="text-sm text-primary hover:text-secondary transition-colors">{employee.phone}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Hiring Status */}
        <div className="care-card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" /> Hiring Status
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>{status.label}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Employment</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${employee.active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                {employee.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {employee.hiringStatus !== "approved" && (
                <Button size="sm" disabled={updating} className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => updateStatus("approved", true)}>
                  <CheckCircle className="w-4 h-4 mr-1" /> Approve
                </Button>
              )}
              {employee.hiringStatus !== "rejected" && (
                <Button size="sm" variant="outline" disabled={updating} className="border-destructive text-destructive hover:bg-destructive/5" onClick={() => updateStatus("rejected", false)}>
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </Button>
              )}
              {employee.active && (
                <Button size="sm" variant="ghost" disabled={updating} onClick={() => updateStatus(employee.hiringStatus, false)}>
                  <Clock className="w-4 h-4 mr-1" /> Deactivate
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="care-card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-secondary" /> Specializations
          </h2>
          {employee.specializations?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {employee.specializations.map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-sm font-medium">{s}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No specializations listed.</p>
          )}
        </div>

        {/* Documents */}
        <div className="care-card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" /> Documents
          </h2>
          {employee.documents?.length > 0 ? (
            <ul className="space-y-2">
              {employee.documents.map((doc, i) => (
                <li key={i}>
                  <a href={doc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:text-secondary transition-colors">
                    <FileText className="w-4 h-4 flex-shrink-0" /> Document {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No documents uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
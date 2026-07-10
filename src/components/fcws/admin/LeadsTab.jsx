import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ClipboardList, Mail, Phone, Loader2 } from "lucide-react";

export default function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    base44.entities.CareLead.list("-created_date").then(data => { setLeads(data); setLoading(false); }).catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-xl text-primary">Care Leads</h2>
        <p className="text-sm text-muted-foreground">{leads.length} total inquiries</p>
      </div>

      <div className="space-y-3">
        {leads.length === 0 ? (
          <div className="care-card text-center py-12">
            <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No care requests yet.</p>
          </div>
        ) : leads.map(lead => (
          <div key={lead.id} className="care-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-primary mb-1">{lead.fullName}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {lead.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {lead.phone}</span>
                </div>
                {lead.serviceInterest && <p className="text-sm"><span className="font-medium text-secondary">Service:</span> {lead.serviceInterest}</p>}
                {lead.message && <p className="text-sm text-muted-foreground mt-2">{lead.message}</p>}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(lead.created_date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
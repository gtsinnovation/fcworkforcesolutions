import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ClipboardList, Mail, Phone, Loader2, Filter, RotateCcw, CheckCircle2, PhoneOutgoing, ChevronDown, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Pagination from "@/components/fcws/admin/Pagination";

const PAGE_SIZE = 25;

const STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  contacted: { label: "Contacted", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  processed: { label: "Processed", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "processed", label: "Processed" },
];

export default function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  function load() {
    base44.entities.CareLead.list("-created_date")
      .then(data => { setLeads(data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    setUpdatingId(id);
    try {
      await base44.entities.CareLead.update(id, { status });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredLeads = activeFilter === "all" ? leads : leads.filter(l => (l.status || "new") === activeFilter);

  const counts = {
    all: leads.length,
    new: leads.filter(l => (l.status || "new") === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    processed: leads.filter(l => l.status === "processed").length,
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));
  const pagedLeads = filteredLeads.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  function handleFilterChange(key) {
    setActiveFilter(key);
    setCurrentPage(0);
    setExpandedId(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-xl text-primary">Care Leads</h2>
        <p className="text-sm text-muted-foreground">{leads.length} total inquiries</p>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => handleFilterChange(f.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {f.label} <span className="opacity-70">({counts[f.key]})</span>
          </button>
        ))}
      </div>

      {filteredLeads.length === 0 ? (
        <div className="care-card text-center py-12">
          <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No {activeFilter === "all" ? "" : activeFilter} leads found.</p>
        </div>
      ) : (
        <div className="care-card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-8"></th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Service Interest</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedLeads.map(lead => {
                const st = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                const isExpanded = expandedId === lead.id;
                return (
                  <React.Fragment key={lead.id}>
                    <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : lead.id)}>
                      <td className="px-4 py-3"><ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} /></td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-primary">{lead.fullName}</p>
                        {lead.message && <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs mt-0.5">{lead.message}</p>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3 h-3" /> {lead.email}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="w-3 h-3" /> {lead.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-secondary text-xs font-medium">{lead.serviceInterest || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(lead.created_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {lead.status !== "contacted" && (
                            <Button size="sm" variant="ghost" disabled={updatingId === lead.id} onClick={() => updateStatus(lead.id, "contacted")} className="h-8 px-2 text-xs" title="Mark as Contacted">
                              <PhoneOutgoing className="w-3.5 h-3.5 mr-1" /> Contacted
                            </Button>
                          )}
                          {lead.status !== "processed" && (
                            <Button size="sm" variant="ghost" disabled={updatingId === lead.id} onClick={() => updateStatus(lead.id, "processed")} className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700" title="Mark as Processed">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Processed
                            </Button>
                          )}
                          {lead.status === "processed" && (
                            <Button size="sm" variant="ghost" disabled={updatingId === lead.id} onClick={() => updateStatus(lead.id, "new")} className="h-8 px-2 text-xs text-muted-foreground" title="Reset to New">
                              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-muted/20">
                        <td colSpan={7} className="px-8 py-4">
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Lead ID</p>
                              <p className="text-foreground break-all">{lead.id}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Submitted</p>
                              <p className="text-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-secondary" /> {new Date(lead.created_date).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Service Interest</p>
                              <p className="text-foreground">{lead.serviceInterest || "—"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Email</p>
                              <p className="text-foreground flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-secondary" /> {lead.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Phone</p>
                              <p className="text-foreground flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-secondary" /> {lead.phone}</p>
                            </div>
                            <div className="sm:col-span-2 lg:col-span-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Message</p>
                              <p className="text-foreground whitespace-pre-wrap p-3 rounded-lg bg-background border border-border">{lead.message || "No message provided"}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredLeads.length} pageSize={PAGE_SIZE} />
    </div>
  );
}
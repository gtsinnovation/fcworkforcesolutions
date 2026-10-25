import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Briefcase, Mail, Phone, MapPin, ChevronDown, Filter, Clock, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Pagination from "@/components/fcws/admin/Pagination";
import DeleteButton from "@/components/fcws/admin/DeleteButton";
import { APPLICATION_STATUS, APPLICATION_STATUS_ORDER, statusInfo } from "@/lib/applications";

const PAGE_SIZE = 25;
const SELECT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export default function ApplicationsTab() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [user, setUser] = useState(null);

  function load() {
    base44.entities.JobApplication.list("-created_date")
      .then((data) => { setApplications(data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    load();
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  function draftFor(app) {
    return drafts[app.id] || { status: app.status || "submitted", decisionNote: app.decisionNote || "" };
  }

  function updateDraft(app, patch) {
    setDrafts((d) => ({ ...d, [app.id]: { ...draftFor(app), ...patch } }));
  }

  async function saveReview(app) {
    const draft = draftFor(app);
    setSavingId(app.id);
    try {
      await base44.entities.JobApplication.update(app.id, {
        status: draft.status,
        decisionNote: draft.decisionNote,
        reviewedByName: user?.full_name || user?.email || "Reviewer",
      });
      setDrafts((d) => {
        const next = { ...d };
        delete next[app.id];
        return next;
      });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  }

  const filtered = activeFilter === "all" ? applications : applications.filter((a) => (a.status || "submitted") === activeFilter);

  const counts = { all: applications.length };
  APPLICATION_STATUS_ORDER.forEach((key) => {
    counts[key] = applications.filter((a) => (a.status || "submitted") === key).length;
  });

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));
  const paged = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  function handleFilterChange(key) {
    setActiveFilter(key);
    setCurrentPage(0);
    setExpandedId(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-xl text-primary">Job Applications</h2>
        <p className="text-sm text-muted-foreground">
          {applications.length} caregiver application{applications.length === 1 ? "" : "s"} submitted
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
          }`}
        >
          All <span className="opacity-70">({counts.all})</span>
        </button>
        {APPLICATION_STATUS_ORDER.map((key) => (
          <button
            key={key}
            onClick={() => handleFilterChange(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {APPLICATION_STATUS[key].label} <span className="opacity-70">({counts[key]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="care-card text-center py-12">
          <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No {activeFilter === "all" ? "" : APPLICATION_STATUS[activeFilter].label.toLowerCase()} applications yet.
          </p>
        </div>
      ) : (
        <div className="care-card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-8"></th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Applicant</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Experience</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((app) => {
                const st = statusInfo(app.status);
                const isExpanded = expandedId === app.id;
                const draft = draftFor(app);
                return (
                  <React.Fragment key={app.id}>
                    <tr
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : app.id)}
                    >
                      <td className="px-4 py-3">
                        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-primary">{app.fullName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(app.created_date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3 h-3" /> {app.email}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="w-3 h-3" /> {app.phone}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" /> {app.city}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-secondary text-xs font-medium">{app.position || "—"}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground whitespace-nowrap">
                        {app.yearsExperience} yr{app.yearsExperience === 1 ? "" : "s"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <DeleteButton
                          onDelete={() => base44.entities.JobApplication.delete(app.id).then(load)}
                          description="This will permanently delete this job application."
                        />
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-muted/20">
                        <td colSpan={7} className="px-8 py-5">
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm mb-5">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Submitted</p>
                              <p className="text-foreground flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-secondary" /> {new Date(app.created_date).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Phone</p>
                              <p className="text-foreground flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-secondary" /> {app.phone}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">City / Town</p>
                              <p className="text-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-secondary" /> {app.city}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Email</p>
                              <p className="text-foreground flex items-center gap-1 break-all"><Mail className="w-3.5 h-3.5 text-secondary" /> {app.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Role Applied For</p>
                              <p className="text-foreground">{app.position || "—"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Experience</p>
                              <p className="text-foreground">{app.yearsExperience} year(s)</p>
                            </div>
                            <div className="sm:col-span-2 lg:col-span-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Caregiving Experience</p>
                              <p className="text-foreground whitespace-pre-wrap p-3 rounded-lg bg-background border border-border">{app.experience}</p>
                            </div>
                            {app.reviewedByName && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Last Reviewed By</p>
                                <p className="text-foreground">{app.reviewedByName}</p>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-border pt-5 grid gap-4 sm:grid-cols-[220px_1fr_auto] sm:items-end">
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase">Application Status</p>
                              <select
                                className={SELECT_CLASS}
                                value={draft.status}
                                onChange={(e) => updateDraft(app, { status: e.target.value })}
                              >
                                {APPLICATION_STATUS_ORDER.map((key) => (
                                  <option key={key} value={key}>{APPLICATION_STATUS[key].label}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase">Note for the Applicant</p>
                              <Textarea
                                rows={2}
                                value={draft.decisionNote}
                                onChange={(e) => updateDraft(app, { decisionNote: e.target.value })}
                                placeholder="Optional note the applicant will see on their status page."
                              />
                            </div>
                            <Button
                              onClick={() => saveReview(app)}
                              disabled={savingId === app.id}
                              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                            >
                              {savingId === app.id ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                              ) : (
                                <><Save className="w-4 h-4 mr-2" /> Save Review</>
                              )}
                            </Button>
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

      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
    </div>
  );
}
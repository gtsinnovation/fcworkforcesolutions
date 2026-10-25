import { Check, XCircle } from "lucide-react";
import { APPLICATION_FLOW, statusInfo } from "@/lib/applications";

export default function ApplicationStatusTracker({ application }) {
  const info = statusInfo(application.status);
  const declined = application.status === "not_selected";
  const activeIndex = APPLICATION_FLOW.indexOf(application.status);
  const submittedAt = application.submittedAt || application.created_date;

  return (
    <div className="care-card">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="font-heading font-semibold text-lg text-primary">{application.position}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Reference <span className="font-mono font-semibold text-foreground">{application.lookupCode || "—"}</span>
            {submittedAt && ` · Submitted ${new Date(submittedAt).toLocaleDateString()}`}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${info.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
          {info.label}
        </span>
      </div>

      {declined ? (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100 mb-5">
          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{info.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-1 mb-5">
          {APPLICATION_FLOW.map((step, i) => {
            const done = activeIndex >= i;
            return (
              <div key={step} className="flex flex-col items-center text-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    done ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : <span className="text-[11px] font-semibold">{i + 1}</span>}
                </div>
                <span className={`text-[10px] leading-tight ${done ? "text-secondary font-semibold" : "text-muted-foreground"}`}>
                  {statusInfo(step).label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {!declined && <p className="text-sm text-muted-foreground mb-5">{info.message}</p>}

      {application.decisionNote && (
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Note from our team</p>
          <p className="text-sm text-foreground whitespace-pre-wrap">{application.decisionNote}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 text-sm border-t border-border pt-5">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Applicant</p>
          <p className="text-foreground">{application.fullName}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">City / Town</p>
          <p className="text-foreground">{application.city}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Email</p>
          <p className="text-foreground break-all">{application.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Phone</p>
          <p className="text-foreground">{application.phone}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Experience</p>
          <p className="text-foreground">{application.yearsExperience} year(s)</p>
        </div>
        {application.experience && (
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">What they shared</p>
            <p className="text-foreground whitespace-pre-wrap p-3 rounded-lg bg-muted/40 border border-border">
              {application.experience}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
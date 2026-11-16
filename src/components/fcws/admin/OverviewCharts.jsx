import { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Activity, ClipboardList, ArrowRight } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PeriodFilter from "./analytics/PeriodFilter";
import { PERIODS, periodStart, periodLabel, localDateKey } from "@/lib/analytics";

// "Today" trends live in the Analytics tab — the overview shows multi-day trends.
const TREND_PERIODS = PERIODS.filter((p) => p.key !== "today");

const TOOLTIP_STYLE = {
  borderRadius: "0.75rem",
  border: "1px solid hsl(var(--border))",
  fontSize: "12px",
};

function countByDay(records) {
  const counts = {};
  records.forEach((r) => {
    if (!r.created_date) return;
    const key = localDateKey(r.created_date);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function buildBuckets(visits, leads, period) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let days = PERIODS.find((p) => p.key === period)?.days || 14;

  if (period === "all") {
    const stamps = [...visits, ...leads]
      .map((r) => (r.created_date ? new Date(r.created_date).getTime() : null))
      .filter((t) => t !== null);
    days = stamps.length
      ? Math.min(Math.max(Math.ceil((now - Math.min(...stamps)) / 86400000) + 1, 7), 365)
      : 14;
  }

  // Long ranges are grouped into weeks so the chart stays readable.
  const step = days > 45 ? 7 : 1;
  const visitCounts = countByDay(visits);
  const leadCounts = countByDay(leads);

  const buckets = [];
  for (let i = days - 1; i >= 0; i -= step) {
    const start = new Date(now);
    start.setDate(start.getDate() - i);
    let visitTotal = 0;
    let leadTotal = 0;
    for (let d = 0; d < step; d++) {
      const day = new Date(start);
      day.setDate(day.getDate() + d);
      const key = localDateKey(day);
      visitTotal += visitCounts[key] || 0;
      leadTotal += leadCounts[key] || 0;
    }
    buckets.push({
      key: localDateKey(start),
      label: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visits: visitTotal,
      leads: leadTotal,
    });
  }
  return buckets;
}

function ChartLoading() {
  return (
    <div className="flex justify-center items-center h-[220px]">
      <div className="w-7 h-7 border-4 border-muted border-t-secondary rounded-full animate-spin" />
    </div>
  );
}

export default function OverviewCharts({ onNavigate }) {
  const [period, setPeriod] = useState("14d");
  const [visits, setVisits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = periodStart(period);
    const query = start ? { created_date: { $gte: start.toISOString() } } : {};
    let cancelled = false;
    setLoading(true);

    Promise.all([
      base44.entities.Visit.filter(query, { sort: "-created_date", limit: 2000 }),
      base44.entities.CareLead.filter(query, { sort: "-created_date", limit: 1000 }),
    ])
      .then(([visitPage, leadPage]) => {
        if (cancelled) return;
        setVisits(visitPage.items || []);
        setLeads(leadPage.items || []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setVisits([]);
        setLeads([]);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [period]);

  const buckets = useMemo(() => buildBuckets(visits, leads, period), [visits, leads, period]);

  const leadStatus = useMemo(() => {
    const counts = { new: 0, contacted: 0, processed: 0 };
    leads.forEach((l) => {
      const key = l.status || "new";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [leads]);

  const label = periodLabel(period);
  const totalVisits = visits.length;
  const peakDay = buckets.reduce((max, b) => (b.visits > max.visits ? b : max), { label: "—", visits: 0 });

  const statusChips = [
    { key: "new", label: "New", className: "bg-accent/15 text-accent-foreground" },
    { key: "contacted", label: "Contacted", className: "bg-secondary/15 text-secondary" },
    { key: "processed", label: "Processed", className: "bg-muted text-muted-foreground" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-heading font-semibold text-lg text-primary">Trends</h3>
          <p className="text-xs text-muted-foreground">Visitor traffic and care request activity over time</p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} periods={TREND_PERIODS} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="care-card">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h4 className="font-heading font-semibold text-primary flex items-center gap-2">
                <Activity className="w-4 h-4 text-secondary" /> Visitor Traffic
              </h4>
              <p className="text-xs text-muted-foreground">Daily page views · {label}</p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate("analytics")}
                className="text-xs font-semibold text-accent hover:text-primary inline-flex items-center gap-1 shrink-0"
              >
                Analytics <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-end gap-5 my-3">
            <div>
              <div className="font-heading font-bold text-2xl text-primary">{totalVisits}</div>
              <div className="text-[11px] text-muted-foreground">total visits</div>
            </div>
            <div>
              <div className="font-heading font-bold text-2xl text-primary">{peakDay.visits}</div>
              <div className="text-[11px] text-muted-foreground">peak day · {peakDay.label}</div>
            </div>
          </div>

          {loading ? (
            <ChartLoading />
          ) : totalVisits === 0 ? (
            <p className="text-sm text-muted-foreground py-14 text-center">No visits recorded in this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={buckets} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="visits"
                  name="Visits"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  fill="hsl(var(--secondary))"
                  fillOpacity={0.18}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="care-card">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h4 className="font-heading font-semibold text-primary flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-accent" /> Care Requests
              </h4>
              <p className="text-xs text-muted-foreground">Care lead submissions · {label}</p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate("leads")}
                className="text-xs font-semibold text-accent hover:text-primary inline-flex items-center gap-1 shrink-0"
              >
                Leads <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-end gap-3 my-3">
            <div>
              <div className="font-heading font-bold text-2xl text-primary">{leads.length}</div>
              <div className="text-[11px] text-muted-foreground">submissions in period</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {statusChips.map((chip) => (
              <span
                key={chip.key}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${chip.className}`}
              >
                {chip.label}: {leadStatus[chip.key] || 0}
              </span>
            ))}
          </div>

          {loading ? (
            <ChartLoading />
          ) : leads.length === 0 ? (
            <p className="text-sm text-muted-foreground py-14 text-center">No care requests in this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={buckets} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="leads" name="Care requests" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
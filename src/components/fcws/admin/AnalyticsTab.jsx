import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Activity, MousePointerClick, CalendarDays, Layers, ExternalLink } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import PeriodFilter from "./analytics/PeriodFilter";
import MetricCard from "./analytics/MetricCard";
import SourceList from "./analytics/SourceList";
import VisitDetailDialog from "./analytics/VisitDetailDialog";
import {
  PERIODS,
  periodStart,
  periodLabel,
  localDateKey,
  sourceLabel,
  countryName,
  formatTimestamp,
} from "@/lib/analytics";

const VISIT_COLUMNS = [
  { key: "time", label: "Time", render: (r) => formatTimestamp(r.created_date) },
  { key: "page", label: "Page", render: (r) => r.page || r.path || "—" },
  { key: "path", label: "Path", render: (r) => r.path || "—" },
  { key: "source", label: "Source", render: (r) => sourceLabel(r.referrer) },
  { key: "country", label: "Country", render: (r) => countryName(r.country) },
  { key: "locale", label: "Language", render: (r) => r.locale || "—" },
];

const SESSION_COLUMNS = [
  { key: "session", label: "Session", render: (r) => String(r.id).slice(0, 14) },
  { key: "pages", label: "Pages Viewed" },
  { key: "first", label: "First Seen", render: (r) => formatTimestamp(r.first) },
  { key: "last", label: "Last Active", render: (r) => formatTimestamp(r.last) },
  { key: "country", label: "Country", render: (r) => countryName(r.country) },
];

function buildBuckets(filtered, period) {
  const now = new Date();

  if (period === "today") {
    return Array.from({ length: 24 }, (_, hour) => ({
      key: String(hour),
      label: `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? "AM" : "PM"}`,
      visits: filtered.filter((v) => v.created_date && new Date(v.created_date).getHours() === hour).length,
    }));
  }

  let days = PERIODS.find((p) => p.key === period)?.days || 14;
  if (period === "all") {
    if (filtered.length) {
      const earliest = filtered.reduce(
        (min, v) => (v.created_date && new Date(v.created_date) < min ? new Date(v.created_date) : min),
        now
      );
      days = Math.min(Math.max(Math.ceil((now - earliest) / 86400000) + 1, 7), 60);
    } else {
      days = 14;
    }
  }

  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    buckets.push({
      key: localDateKey(dayStart),
      label: dayStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visits: filtered.filter((v) => {
        if (!v.created_date) return false;
        const at = new Date(v.created_date);
        return at >= dayStart && at < dayEnd;
      }).length,
    });
  }
  return buckets;
}

export default function AnalyticsTab() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("14d");
  const [report, setReport] = useState(null);

  useEffect(() => {
    base44.entities.Visit.list("-created_date", 1000)
      .then((data) => { setVisits(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const start = periodStart(period);
    const filtered = start ? visits.filter((v) => v.created_date && new Date(v.created_date) >= start) : visits;

    const sessionMap = new Map();
    filtered.forEach((v) => {
      const key = v.sessionId || v.id;
      const current = sessionMap.get(key) || { id: key, pages: 0, country: "", first: v.created_date, last: v.created_date };
      current.pages += 1;
      if (v.created_date) {
        if (!current.first || new Date(v.created_date) < new Date(current.first)) current.first = v.created_date;
        if (!current.last || new Date(v.created_date) > new Date(current.last)) current.last = v.created_date;
      }
      if (!current.country && v.country) current.country = v.country;
      sessionMap.set(key, current);
    });
    const sessions = Array.from(sessionMap.values());

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayVisits = visits.filter((v) => v.created_date && new Date(v.created_date) >= todayStart);

    const topFrom = (pick, limit) => {
      const counts = {};
      filtered.forEach((v) => {
        const key = pick(v);
        counts[key] = (counts[key] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([key, count]) => ({ name: key, count }));
    };

    return {
      filtered,
      sessions,
      todayVisits,
      totalVisits: filtered.length,
      uniqueVisitors: sessions.length,
      avgPages: sessions.length ? filtered.length / sessions.length : 0,
      topPages: topFrom((v) => v.page || v.path || "Unknown", 8),
      topReferrers: topFrom((v) => sourceLabel(v.referrer), 6),
      topCountries: topFrom((v) => countryName(v.country), 6),
      buckets: buildBuckets(filtered, period),
      recent: filtered.slice(0, 10),
    };
  }, [visits, period]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-heading font-bold text-xl text-primary">Visitor Traffic Analytics</h2>
          <p className="text-sm text-muted-foreground">Track site visitors, engagement, and traffic sources</p>
        </div>
        <div className="care-card text-center py-12">
          <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No visitor data yet. Analytics will appear here as visitors browse your site.</p>
        </div>
      </div>
    );
  }

  const label = periodLabel(period);
  const isHourly = period === "today";

  const metricCards = [
    {
      label: "Total Visits",
      value: stats.totalVisits,
      sub: `Page views · ${label}`,
      icon: Activity,
      tone: "text-secondary",
      onClick: () => setReport({
        title: `All Visits — ${label}`,
        subtitle: `${stats.totalVisits} page views recorded`,
        columns: VISIT_COLUMNS,
        rows: stats.filtered,
      }),
    },
    {
      label: "Unique Visitors",
      value: stats.uniqueVisitors,
      sub: `Distinct sessions · ${label}`,
      icon: MousePointerClick,
      tone: "text-accent",
      onClick: () => setReport({
        title: `Unique Visitors — ${label}`,
        subtitle: `${stats.uniqueVisitors} distinct sessions`,
        columns: SESSION_COLUMNS,
        rows: stats.sessions,
      }),
    },
    {
      label: "Pages / Session",
      value: stats.avgPages.toFixed(1),
      sub: "Engagement depth per visit",
      icon: Layers,
      tone: "text-secondary",
      onClick: () => setReport({
        title: "Pages per Session",
        subtitle: "How deeply each visitor engaged, session by session",
        columns: SESSION_COLUMNS,
        rows: [...stats.sessions].sort((a, b) => b.pages - a.pages),
      }),
    },
    {
      label: "Visits Today",
      value: stats.todayVisits.length,
      sub: "Since midnight",
      icon: CalendarDays,
      tone: "text-accent",
      onClick: () => setReport({
        title: "Visits Today",
        subtitle: `${stats.todayVisits.length} page views since midnight`,
        columns: VISIT_COLUMNS,
        rows: stats.todayVisits,
      }),
    },
  ];

  const openBucketReport = (bucket) => {
    const rows = isHourly
      ? stats.todayVisits.filter((v) => v.created_date && new Date(v.created_date).getHours() === Number(bucket.key))
      : stats.filtered.filter((v) => v.created_date && localDateKey(v.created_date) === bucket.key);
    setReport({
      title: `${bucket.label} — ${bucket.visits} visit${bucket.visits === 1 ? "" : "s"}`,
      subtitle: isHourly ? "Hourly engagement breakdown" : "Daily engagement breakdown",
      columns: VISIT_COLUMNS,
      rows,
    });
  };

  const handleBarClick = (entry) => {
    const bucket = entry && (entry.payload || entry);
    if (bucket && bucket.key !== undefined) openBucketReport(bucket);
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl text-primary">Visitor Traffic Analytics</h2>
          <p className="text-sm text-muted-foreground">Engagement, traffic sources and country of origin</p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      <div className="care-card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
          <h3 className="font-heading font-semibold text-primary">
            Visits — {isHourly ? "Today by Hour" : label}
          </h3>
          <p className="text-xs text-muted-foreground">Click any bar to open a detailed report</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.buckets} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))" }} />
            <Bar
              dataKey="visits"
              fill="hsl(var(--secondary))"
              radius={[4, 4, 0, 0]}
              cursor="pointer"
              onClick={handleBarClick}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="care-card">
          <h3 className="font-heading font-semibold text-primary mb-1">Top Pages</h3>
          <p className="text-xs text-muted-foreground mb-4">Most viewed pages · {label}</p>
          {stats.topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No page views in this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.topPages} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={110} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem" }} />
                <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <SourceList
          title="Traffic Sources"
          caption={`Where visitors came from · ${label}`}
          items={stats.topReferrers}
          emptyText="No referral data in this period. Visitors arriving directly are grouped as Direct."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <SourceList
          title="Top Countries"
          caption={`Country of origin · ${label}`}
          items={stats.topCountries}
          emptyText="No country data in this period. New visits will be geolocated automatically."
        />

        <div className="care-card">
          <h3 className="font-heading font-semibold text-primary mb-1">Recent Visits</h3>
          <p className="text-xs text-muted-foreground mb-4">Latest activity · {label}</p>
          <div className="space-y-2">
            {stats.recent.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <ExternalLink className="w-4 h-4 text-secondary shrink-0" />
                  <span className="font-medium text-foreground truncate">{v.page || v.path}</span>
                  <span className="text-muted-foreground truncate hidden sm:inline">
                    {sourceLabel(v.referrer)} · {countryName(v.country)}
                  </span>
                </div>
                <span className="text-muted-foreground shrink-0 ml-2">{formatTimestamp(v.created_date)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VisitDetailDialog report={report} onClose={() => setReport(null)} />
    </div>
  );
}
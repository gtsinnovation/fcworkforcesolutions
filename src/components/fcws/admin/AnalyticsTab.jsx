import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Activity, MousePointerClick, CalendarDays, TrendingUp, Globe, ExternalLink } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsTab() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Visit.list("-created_date", 1000)
      .then((data) => { setVisits(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const totalVisits = visits.length;
    const uniqueSessions = new Set(visits.map((v) => v.sessionId).filter(Boolean)).size;

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const visitsToday = visits.filter((v) => new Date(v.created_date) >= today).length;

    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const visitsThisWeek = visits.filter((v) => new Date(v.created_date) >= weekAgo).length;

    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const count = visits.filter((v) => {
        const vd = new Date(v.created_date);
        return vd >= d && vd < next;
      }).length;
      days.push({ date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), visits: count });
    }

    const pageCounts = {};
    visits.forEach((v) => {
      const k = v.page || v.path;
      pageCounts[k] = (pageCounts[k] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    const refCounts = {};
    visits.forEach((v) => {
      if (v.referrer) {
        const r = String(v.referrer).replace(/^https?:\/\//, "").split("/")[0];
        if (r) refCounts[r] = (refCounts[r] || 0) + 1;
      }
    });
    const topReferrers = Object.entries(refCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const recent = visits.slice(0, 8);

    return { totalVisits, uniqueSessions, visitsToday, visitsThisWeek, days, topPages, topReferrers, recent };
  }, [visits]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Visits", value: stats.totalVisits, icon: Activity, color: "text-secondary" },
    { label: "Unique Sessions", value: stats.uniqueSessions, icon: MousePointerClick, color: "text-accent" },
    { label: "Visits Today", value: stats.visitsToday, icon: CalendarDays, color: "text-secondary" },
    { label: "Visits This Week", value: stats.visitsThisWeek, icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-xl text-primary">Visitor Traffic Analytics</h2>
        <p className="text-sm text-muted-foreground">Track site visitors, page views, and traffic sources</p>
      </div>

      {stats.totalVisits === 0 ? (
        <div className="care-card text-center py-12">
          <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No visitor data yet. Analytics will appear here as visitors browse your site.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="care-card">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">{s.label}</p>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <p className="font-heading font-bold text-2xl text-primary">{s.value}</p>
                </div>
              );
            })}
          </div>

          <div className="care-card mb-6">
            <h3 className="font-heading font-semibold text-primary mb-4">Visits — Last 14 Days</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stats.days}>
                <defs>
                  <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))" }} />
                <Area type="monotone" dataKey="visits" stroke="hsl(var(--secondary))" strokeWidth={2} fill="url(#visitGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="care-card">
              <h3 className="font-heading font-semibold text-primary mb-4">Top Pages</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.topPages} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={110} />
                  <Tooltip contentStyle={{ borderRadius: "0.75rem" }} />
                  <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="care-card">
              <h3 className="font-heading font-semibold text-primary mb-4">Top Referrers</h3>
              {stats.topReferrers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No referrer data yet — visitors arriving directly will show here once referral links exist.</p>
              ) : (
                <div className="space-y-2">
                  {stats.topReferrers.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                      <span className="text-sm text-foreground flex items-center gap-2 truncate">
                        <Globe className="w-4 h-4 text-secondary shrink-0" /> {r.name}
                      </span>
                      <span className="text-sm font-semibold text-primary shrink-0">{r.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="care-card mt-6">
            <h3 className="font-heading font-semibold text-primary mb-4">Recent Visits</h3>
            <div className="space-y-2">
              {stats.recent.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <ExternalLink className="w-4 h-4 text-secondary shrink-0" />
                    <span className="font-medium text-foreground truncate">{v.page || v.path}</span>
                    <span className="text-muted-foreground truncate hidden sm:inline">{v.path}</span>
                  </div>
                  <span className="text-muted-foreground shrink-0 ml-2">
                    {v.created_date ? new Date(v.created_date).toLocaleString() : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
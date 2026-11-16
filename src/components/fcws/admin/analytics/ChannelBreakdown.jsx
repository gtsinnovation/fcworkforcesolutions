import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

const TOOLTIP_STYLE = {
  borderRadius: "0.75rem",
  border: "1px solid hsl(var(--border))",
  fontSize: "12px",
};

export default function ChannelBreakdown({ rows, label }) {
  const total = rows.reduce((sum, row) => sum + row.visitors, 0);

  return (
    <div className="care-card mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-heading font-semibold text-primary">Traffic Channels</h3>
          <p className="text-xs text-muted-foreground">Where each visitor arrived from · {label}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-heading font-bold text-xl text-primary">{total}</div>
          <div className="text-[11px] text-muted-foreground">visitors</div>
        </div>
      </div>

      {total === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No visitor sources recorded in this period.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-[230px_1fr] md:items-center">
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie
                data={rows}
                dataKey="visitors"
                nameKey="label"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                strokeWidth={0}
              >
                {rows.map((row) => (
                  <Cell key={row.key} fill={row.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value, name) => [`${value} visitor${value === 1 ? "" : "s"}`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.key}>
                <div className="flex items-center justify-between text-sm gap-2">
                  <span className="flex items-center gap-2 font-medium text-foreground min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: row.color }}
                    />
                    <span className="truncate">{row.label}</span>
                  </span>
                  <span className="text-primary font-semibold shrink-0">
                    {row.visitors} · {row.share}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${row.share}%`, background: row.color }}
                  />
                </div>
                {row.key !== "direct" && row.sources.length > 0 && (
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">
                    {row.sources.map((s) => `${s.name} (${s.count})`).join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
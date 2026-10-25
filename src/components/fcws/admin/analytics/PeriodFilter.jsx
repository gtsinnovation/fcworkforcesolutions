import { PERIODS } from "@/lib/analytics";

export default function PeriodFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PERIODS.map((p) => {
        const active = p.key === value;
        return (
          <button
            key={p.key}
            type="button"
            onClick={() => onChange(p.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-accent hover:text-accent"
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
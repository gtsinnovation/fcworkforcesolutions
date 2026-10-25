export default function MetricCard({ label, value, sub, icon: Icon, tone, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="care-card w-full text-left hover:border-accent hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase">{label}</p>
        <Icon className={`w-5 h-5 ${tone}`} />
      </div>
      <p className="font-heading font-bold text-2xl text-primary">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      <p className="text-[11px] font-semibold text-accent mt-2">View detailed report →</p>
    </button>
  );
}
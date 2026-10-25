import { Globe } from "lucide-react";

export default function SourceList({ title, caption, items, emptyText }) {
  return (
    <div className="care-card">
      <h3 className="font-heading font-semibold text-primary mb-1">{title}</h3>
      {caption && <p className="text-xs text-muted-foreground mb-4">{caption}</p>}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {items.map((r, i) => (
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
  );
}
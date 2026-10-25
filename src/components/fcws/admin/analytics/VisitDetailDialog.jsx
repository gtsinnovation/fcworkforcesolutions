import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function VisitDetailDialog({ report, onClose }) {
  const [current, setCurrent] = useState(report);

  useEffect(() => {
    if (report) setCurrent(report);
  }, [report]);

  return (
    <Dialog open={!!report} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        {current && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-primary">{current.title}</DialogTitle>
              {current.subtitle && <DialogDescription>{current.subtitle}</DialogDescription>}
            </DialogHeader>

            {current.rows.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No records for this report.</p>
            ) : (
              <div className="rounded-lg border border-border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {current.columns.map((c) => (
                        <TableHead key={c.key}>{c.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {current.rows.map((row, i) => (
                      <TableRow key={i}>
                        {current.columns.map((c) => (
                          <TableCell key={c.key}>
                            {c.render ? c.render(row) : row[c.key] ?? "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
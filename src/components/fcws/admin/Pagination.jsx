import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize = 25 }) {
  if (totalItems <= pageSize) return null;
  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalItems);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
      <p className="text-sm text-muted-foreground">Showing {start}–{end} of {totalItems}</p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <span className="text-sm font-medium text-foreground">Page {currentPage + 1} of {totalPages}</span>
        <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1} onClick={() => onPageChange(currentPage + 1)}>
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
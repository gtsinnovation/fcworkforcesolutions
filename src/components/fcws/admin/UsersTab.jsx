import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Shield, Heart, UserCircle, Mail, ChevronDown, Calendar, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Pagination from "@/components/fcws/admin/Pagination";
import DeleteButton from "@/components/fcws/admin/DeleteButton";
import { useToast } from "@/components/ui/use-toast";

const PAGE_SIZE = 25;

const ROLES = [
  { value: "admin", label: "Admin", icon: Shield },
  { value: "caregiver", label: "Caregiver", icon: Heart },
  { value: "client", label: "Client / Family", icon: UserCircle },
];

const ROLE_BADGE = {
  admin: "bg-accent/15 text-accent",
  caregiver: "bg-secondary/15 text-secondary",
  client: "bg-blue-100 text-blue-700",
};

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const { toast } = useToast();

  function load() {
    base44.entities.User.list().then(data => { setUsers(data); setLoading(false); }).catch(() => setLoading(false));
  }

  useEffect(() => {
    load();
    base44.auth.me().then(u => setCurrentUserId(u?.id || null)).catch(() => {});
  }, []);

  async function handleDelete(userId, email) {
    try {
      await base44.entities.User.delete(userId);
      toast({ title: "User deleted", description: email });
      load();
    } catch (err) {
      toast({ title: "Failed to delete user", description: err.message, variant: "destructive" });
    }
  }

  async function handleRoleChange(userId, newRole) {
    setUpdatingId(userId);
    try {
      await base44.entities.User.update(userId, { role: newRole });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));
  const pagedUsers = users.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-xl text-primary">User Management</h2>
        <p className="text-sm text-muted-foreground">Assign roles to control what each user can access</p>
      </div>

      <div className="care-card mb-6">
        <div className="grid gap-3 sm:grid-cols-3 text-center">
          {ROLES.map(r => {
            const Icon = r.icon;
            const count = users.filter(u => u.role === r.value).length;
            return (
              <div key={r.value} className="p-3 rounded-lg bg-muted/40">
                <Icon className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <div className="font-heading font-bold text-lg text-primary">{count}</div>
                <div className="text-xs text-muted-foreground">{r.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {pagedUsers.map(u => {
          const isExpanded = expandedId === u.id;
          return (
            <div key={u.id} className="care-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : u.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0", isExpanded && "rotate-180")} />
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{u.full_name || u.email}</p>
                    {u.full_name && <p className="text-xs text-muted-foreground truncate">{u.email}</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${ROLE_BADGE[u.role] || ROLE_BADGE.client}`}>
                    {u.role || "client"}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  {updatingId === u.id && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                  <Select value={u.role || "client"} onValueChange={(v) => handleRoleChange(u.id, v)} disabled={updatingId === u.id}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {u.id !== currentUserId && (
                    <DeleteButton label="" onDelete={() => handleDelete(u.id, u.email)} description="This will permanently delete this user account. This action cannot be undone." />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">User ID</p>
                    <p className="text-foreground break-all">{u.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Full Name</p>
                    <p className="text-foreground flex items-center gap-1"><User className="w-3.5 h-3.5 text-secondary" /> {u.full_name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Email</p>
                    <p className="text-foreground flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-secondary" /> {u.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Joined</p>
                    <p className="text-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-secondary" /> {u.created_date ? new Date(u.created_date).toLocaleDateString() : "—"}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={users.length} pageSize={PAGE_SIZE} />
    </div>
  );
}
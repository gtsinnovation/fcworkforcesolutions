import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Mail, ChevronDown, Calendar, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Pagination from "@/components/fcws/admin/Pagination";
import DeleteButton from "@/components/fcws/admin/DeleteButton";
import { useToast } from "@/components/ui/use-toast";
import { logAudit } from "@/lib/audit";
import { APP_ROLES, roleInfo, roleLabel } from "@/lib/roles";

const PAGE_SIZE = 25;
const ROLES = APP_ROLES;

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);
  const [emptyRole, setEmptyRole] = useState(null);
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
      await logAudit("user.deleted", `Deleted the account ${email}`);
      toast({ title: "User deleted", description: email });
      load();
    } catch (err) {
      toast({ title: "Failed to delete user", description: err.message, variant: "destructive" });
    }
  }

  async function handleRoleChange(userId, newRole) {
    setUpdatingId(userId);
    try {
      const target = users.find(u => u.id === userId);
      const previous = target?.role || "client";
      await base44.entities.User.update(userId, { role: newRole });
      if (previous !== newRole) {
        await logAudit(
          "user.role_changed",
          `Changed ${target?.email || "an account"} from ${roleLabel(previous)} to ${roleLabel(newRole)}`
        );
      }
      load();
    } catch (err) {
      toast({ title: "Could not change role", description: err.message, variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  const visibleUsers = roleFilter ? users.filter(u => (u.role || "client") === roleFilter) : users;
  const totalPages = Math.ceil(visibleUsers.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));
  const pagedUsers = visibleUsers.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const handleRoleCard = (role, count) => {
    if (count > 0) {
      setRoleFilter(roleFilter === role ? null : role);
      setCurrentPage(0);
      setExpandedId(null);
    } else {
      setEmptyRole(emptyRole === role ? null : role);
    }
  };

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
            const count = users.filter(u => (u.role || "client") === r.value).length;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => handleRoleCard(r.value, count)}
                className={cn(
                  "p-3 rounded-lg bg-muted/40 transition-all cursor-pointer hover:bg-muted hover:shadow-sm",
                  roleFilter === r.value && "ring-2 ring-secondary"
                )}
              >
                <Icon className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <div className="font-heading font-bold text-lg text-primary">{count}</div>
                <div className="text-xs text-muted-foreground">{r.label}</div>
                {count > 0 ? (
                  <div className="text-[11px] font-semibold text-accent mt-1">View users →</div>
                ) : (
                  <div className={`text-[11px] mt-1 ${emptyRole === r.value ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {emptyRole === r.value ? "No users with this role yet." : "No data yet"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {roleFilter && (
        <div className="flex items-center justify-between gap-3 mb-4 text-sm">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{ROLES.find(r => r.value === roleFilter)?.label}</span> users ({visibleUsers.length})
          </p>
          <button type="button" onClick={() => setRoleFilter(null)} className="font-semibold text-secondary hover:underline">
            Show all users
          </button>
        </div>
      )}

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
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${roleInfo(u.role).badge}`}>
                    {roleLabel(u.role)}
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

      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={visibleUsers.length} pageSize={PAGE_SIZE} />
    </div>
  );
}
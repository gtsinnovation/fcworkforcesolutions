import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Shield, Heart, UserCircle, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  function load() {
    base44.entities.User.list().then(data => { setUsers(data); setLoading(false); }).catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

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
        {users.map(u => (
          <div key={u.id} className="care-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
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
            <div className="flex items-center gap-2 shrink-0">
              {updatingId === u.id && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              <Select value={u.role || "client"} onValueChange={(v) => handleRoleChange(u.id, v)} disabled={updatingId === u.id}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
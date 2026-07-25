import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { UserPlus, Loader2, Shield, Heart, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const ROLES = [
  { value: "admin", label: "Admin", icon: Shield, desc: "Full access to all dashboard features" },
  { value: "caregiver", label: "Caregiver", icon: Heart, desc: "Access to schedules, clients, and incident reporting" },
  { value: "client", label: "Client / Family", icon: UserCircle, desc: "Access to the family portal for care updates" },
];

export default function InviteUserDialog({ onInvited }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("caregiver");
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();

  async function handleInvite(e) {
    e.preventDefault();
    setInviting(true);
    try {
      const platformRole = role === "admin" ? "admin" : "user";
      await base44.users.inviteUser(email, platformRole);
      const roleLabel = ROLES.find(r => r.value === role)?.label || role;
      const note = role === "admin" ? "" : " Assign their role in User Management once they register.";
      toast({ title: "Invitation sent", description: `${email} was invited as ${roleLabel}.${note}` });
      setOpen(false);
      setEmail("");
      setRole("caregiver");
      onInvited?.();
    } catch (err) {
      toast({ title: "Failed to invite", description: err.message || "Could not send invitation", variant: "destructive" });
    } finally {
      setInviting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <UserPlus className="w-4 h-4 mr-1" /> Invite User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a New User</DialogTitle>
          <DialogDescription>Send an onboarding invitation. The recipient will be able to register and access the app with the role you choose.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email Address</Label>
            <Input id="invite-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{ROLES.find(r => r.value === role)?.desc}</p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={inviting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {inviting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
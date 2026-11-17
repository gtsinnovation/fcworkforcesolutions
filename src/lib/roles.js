import { Shield, UserCog, ClipboardList, Heart, GraduationCap, UserCircle, User } from "lucide-react";

// Every role the app uses, in the order they are shown in the dashboard.
// One source of truth so the Users tab, the invite dialog and the navigation
// can never disagree about which roles exist.
export const APP_ROLES = [
  {
    value: "admin",
    label: "Admin",
    desc: "Full access to every dashboard feature, including user management",
    badge: "bg-accent/15 text-accent",
    icon: Shield,
  },
  {
    value: "org_manager",
    label: "Manager",
    desc: "Runs day-to-day care operations and reviews the audit log",
    badge: "bg-primary/10 text-primary",
    icon: UserCog,
  },
  {
    value: "staff",
    label: "Staff",
    desc: "Manages caregivers, clients, schedules and applications",
    badge: "bg-indigo-100 text-indigo-700",
    icon: ClipboardList,
  },
  {
    value: "caregiver",
    label: "Caregiver",
    desc: "Access to schedules, clients, and incident reporting",
    badge: "bg-secondary/15 text-secondary",
    icon: Heart,
  },
  {
    value: "onboarding",
    label: "Caregiver (onboarding)",
    desc: "A caregiver still completing onboarding",
    badge: "bg-muted text-muted-foreground",
    icon: GraduationCap,
  },
  {
    value: "client",
    label: "Client / Family",
    desc: "Access to the family portal for care updates",
    badge: "bg-blue-100 text-blue-700",
    icon: UserCircle,
  },
  {
    value: "user",
    label: "Member",
    desc: "No dashboard access until an admin assigns a role",
    badge: "bg-muted text-muted-foreground",
    icon: User,
  },
];

export const DEFAULT_ROLE = "client";

export function roleInfo(value) {
  return (
    APP_ROLES.find((role) => role.value === value) ||
    APP_ROLES.find((role) => role.value === DEFAULT_ROLE)
  );
}

export function roleLabel(value) {
  return roleInfo(value).label;
}
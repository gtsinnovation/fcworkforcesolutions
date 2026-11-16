import { LayoutDashboard, Briefcase, Users, CalendarDays, AlertTriangle, FileText, ClipboardList, ClipboardCheck, UserCog, Activity, BookOpen } from "lucide-react";

const MANAGEMENT = ["admin", "org_manager", "staff"];
const LEADERSHIP = ["admin", "org_manager"];

const ADMIN_NAV = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard, roles: MANAGEMENT },
  { label: "Caregivers", path: "/admin?tab=caregivers", icon: Briefcase, roles: MANAGEMENT },
  { label: "Applications", path: "/admin?tab=applications", icon: ClipboardCheck, roles: MANAGEMENT },
  { label: "Clients", path: "/admin?tab=clients", icon: Users, roles: MANAGEMENT },
  { label: "Scheduling", path: "/admin?tab=scheduling", icon: CalendarDays, roles: MANAGEMENT },
  { label: "Incidents", path: "/admin?tab=incidents", icon: AlertTriangle, roles: MANAGEMENT },
  { label: "Audit Log", path: "/admin?tab=audit", icon: FileText, roles: LEADERSHIP },
  { label: "Leads", path: "/admin?tab=leads", icon: ClipboardList, roles: MANAGEMENT },
  { label: "Caregiving Insight", path: "/admin?tab=insight", icon: BookOpen, roles: MANAGEMENT },
  { label: "Analytics", path: "/admin?tab=analytics", icon: Activity, roles: MANAGEMENT },
  { label: "Users", path: "/admin?tab=users", icon: UserCog, roles: LEADERSHIP },
];

// Each entry must point at a real route — schedule details and contact live on
// the dashboard page itself, so they are not separate navigation items.
const CAREGIVER_NAV = [
  { label: "Dashboard", path: "/caregiver", icon: LayoutDashboard, roles: ["caregiver", "onboarding", "admin", "org_manager"] },
];

const CLIENT_NAV = [
  { label: "Family Portal", path: "/portal", icon: LayoutDashboard, roles: ["client", "admin", "org_manager"] },
];

export { ADMIN_NAV, CAREGIVER_NAV, CLIENT_NAV };
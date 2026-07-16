import { LayoutDashboard, Briefcase, Users, CalendarDays, AlertTriangle, FileText, ClipboardList, Clock, Phone, UserCog } from "lucide-react";

const ADMIN_NAV = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Caregivers", path: "/admin?tab=caregivers", icon: Briefcase },
  { label: "Clients", path: "/admin?tab=clients", icon: Users },
  { label: "Scheduling", path: "/admin?tab=scheduling", icon: CalendarDays },
  { label: "Incidents", path: "/admin?tab=incidents", icon: AlertTriangle },
  { label: "Audit Log", path: "/admin?tab=audit", icon: FileText },
  { label: "Leads", path: "/admin?tab=leads", icon: ClipboardList },
  { label: "Users", path: "/admin?tab=users", icon: UserCog },
];

const CAREGIVER_NAV = [
  { label: "Dashboard", path: "/caregiver", icon: LayoutDashboard },
  { label: "Schedule", path: "/caregiver", icon: CalendarDays },
  { label: "File Incident", path: "/caregiver", icon: AlertTriangle },
];

const CLIENT_NAV = [
  { label: "Family Portal", path: "/portal", icon: LayoutDashboard },
  { label: "Schedule", path: "/portal", icon: CalendarDays },
  { label: "Contact Us", path: "/portal", icon: Phone },
];

export { ADMIN_NAV, CAREGIVER_NAV, CLIENT_NAV };
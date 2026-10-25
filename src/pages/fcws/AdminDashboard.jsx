import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import OverviewTab from "@/components/fcws/admin/OverviewTab";
import CaregiversTab from "@/components/fcws/admin/CaregiversTab";
import ApplicationsTab from "@/components/fcws/admin/ApplicationsTab";
import ClientsTab from "@/components/fcws/admin/ClientsTab";
import SchedulingTab from "@/components/fcws/admin/SchedulingTab";
import IncidentsTab from "@/components/fcws/admin/IncidentsTab";
import AuditTab from "@/components/fcws/admin/AuditTab";
import LeadsTab from "@/components/fcws/admin/LeadsTab";
import AnalyticsTab from "@/components/fcws/admin/AnalyticsTab";
import UsersTab from "@/components/fcws/admin/UsersTab";
import InviteUserDialog from "@/components/fcws/admin/InviteUserDialog";

const MANAGEMENT = ["admin", "org_manager", "staff"];
const LEADERSHIP = ["admin", "org_manager"];
const TABS = [
  { key: "overview", label: "Overview", roles: MANAGEMENT },
  { key: "caregivers", label: "Caregivers", roles: MANAGEMENT },
  { key: "applications", label: "Applications", roles: MANAGEMENT },
  { key: "clients", label: "Clients", roles: MANAGEMENT },
  { key: "scheduling", label: "Scheduling", roles: MANAGEMENT },
  { key: "incidents", label: "Incidents", roles: MANAGEMENT },
  { key: "audit", label: "Audit Log", roles: LEADERSHIP },
  { key: "leads", label: "Leads", roles: MANAGEMENT },
  { key: "analytics", label: "Analytics", roles: MANAGEMENT },
  { key: "users", label: "Users", roles: LEADERSHIP },
];

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get("tab") || "overview";
  const visibleTabs = TABS.filter(t => !user?.role || t.roles.includes(user.role));
  const allowedTab = visibleTabs.some(t => t.key === activeTab) ? activeTab : "overview";

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  const setTab = (key) => {
    if (key === "overview") setSearchParams({});
    else setSearchParams({ tab: key });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-primary">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.full_name || user?.email}</p>
        </div>
        {(user?.role === "admin" || user?.role === "org_manager") && <InviteUserDialog />}
      </div>

      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {visibleTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-secondary text-secondary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {allowedTab === "overview" && <OverviewTab />}
      {allowedTab === "caregivers" && <CaregiversTab />}
      {allowedTab === "applications" && <ApplicationsTab />}
      {allowedTab === "clients" && <ClientsTab />}
      {allowedTab === "scheduling" && <SchedulingTab />}
      {allowedTab === "incidents" && <IncidentsTab />}
      {allowedTab === "audit" && <AuditTab />}
      {allowedTab === "leads" && <LeadsTab />}
      {allowedTab === "analytics" && <AnalyticsTab />}
      {allowedTab === "users" && <UsersTab />}
    </div>
  );
}
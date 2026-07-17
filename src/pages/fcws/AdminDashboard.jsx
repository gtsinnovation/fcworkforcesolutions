import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import OverviewTab from "@/components/fcws/admin/OverviewTab";
import CaregiversTab from "@/components/fcws/admin/CaregiversTab";
import ClientsTab from "@/components/fcws/admin/ClientsTab";
import SchedulingTab from "@/components/fcws/admin/SchedulingTab";
import IncidentsTab from "@/components/fcws/admin/IncidentsTab";
import AuditTab from "@/components/fcws/admin/AuditTab";
import LeadsTab from "@/components/fcws/admin/LeadsTab";
import UsersTab from "@/components/fcws/admin/UsersTab";
import InviteUserDialog from "@/components/fcws/admin/InviteUserDialog";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "caregivers", label: "Caregivers" },
  { key: "clients", label: "Clients" },
  { key: "scheduling", label: "Scheduling" },
  { key: "incidents", label: "Incidents" },
  { key: "audit", label: "Audit Log" },
  { key: "leads", label: "Leads" },
  { key: "users", label: "Users" },
];

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get("tab") || "overview";

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
          <h1 className="font-heading font-bold text-2xl text-primary">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.full_name || user?.email}</p>
        </div>
        <InviteUserDialog />
      </div>

      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {TABS.map(tab => (
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

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "caregivers" && <CaregiversTab />}
      {activeTab === "clients" && <ClientsTab />}
      {activeTab === "scheduling" && <SchedulingTab />}
      {activeTab === "incidents" && <IncidentsTab />}
      {activeTab === "audit" && <AuditTab />}
      {activeTab === "leads" && <LeadsTab />}
      {activeTab === "users" && <UsersTab />}
    </div>
  );
}
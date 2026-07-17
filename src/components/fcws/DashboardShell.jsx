import { Outlet, Link, useLocation } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, Users, CalendarDays, AlertTriangle, FileText, Briefcase, LogOut, ClipboardList } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Caregivers", path: "/admin?tab=caregivers", icon: Briefcase },
  { label: "Clients", path: "/admin?tab=clients", icon: Users },
  { label: "Scheduling", path: "/admin?tab=scheduling", icon: CalendarDays },
  { label: "Incidents", path: "/admin?tab=incidents", icon: AlertTriangle },
  { label: "Audit Log", path: "/admin?tab=audit", icon: FileText },
  { label: "Leads", path: "/admin?tab=leads", icon: ClipboardList },
];

export default function DashboardShell({ navItems, title, roleLabel }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center gap-2 px-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-sm">FCWS {roleLabel}</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.filter(item => !item.roles || item.roles.includes(user?.role)).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname + location.search === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-sidebar-foreground/50">Signed in as</p>
            <p className="text-sm font-medium truncate">{user?.email || "..."}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>
          <span className="font-heading font-bold text-primary">{title}</span>
          <div className="w-9" />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { ADMIN_NAV };
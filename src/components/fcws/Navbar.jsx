import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed || cancelled) return;
      try {
        const u = await base44.auth.me();
        if (cancelled) return;
        setUser(u);
        // Standard platform users may have a pending invite that auto-applies their app role.
        if (u && u.role === "user") {
          try {
            const res = await base44.functions.invoke("assignInvitedRole");
            if (res?.data?.status === "upgraded" && !cancelled) {
              window.location.reload();
            }
          } catch (e) { /* ignore; retries on next load */ }
        }
      } catch (e) { /* ignore */ }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="hidden sm:block leading-tight">
            <span className="font-heading font-bold text-base text-primary block">Family Care</span>
            <span className="text-xs text-muted-foreground">Workforce Solutions</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Button asChild size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Link to={["admin","org_manager","staff"].includes(user.role) ? "/admin" : ["caregiver","onboarding"].includes(user.role) ? "/caregiver" : user.role === "client" ? "/portal" : "/"}>
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/request-care">Request Care</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
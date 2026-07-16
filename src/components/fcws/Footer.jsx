import { Home, MessageCircle, Heart, Facebook, Phone, Mail, LayoutDashboard, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function Footer() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then((authed) => {
      if (authed) base44.auth.me().then(setUser).catch(() => {});
    });
  }, []);

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "caregiver" ? "/caregiver" : "/portal";

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-3 text-center md:text-left">
          {/* Contact Us */}
          <div>
            <h3 className="font-heading font-bold text-sm text-accent mb-4">CONTACT US</h3>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>+231 8898 87976 / +231 76 143 5652</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-primary-foreground/60 text-xs">Chat:</span>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition" aria-label="Facebook">
                  <Facebook className="w-5 h-5 text-accent" />
                </a>
                <a href="https://wa.me/231888988796" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition" aria-label="WhatsApp">
                  <MessageCircle className="w-5 h-5 text-accent fill-accent" />
                </a>
                <Link to="/contact" className="hover:opacity-80 transition" aria-label="Email">
                  <Mail className="w-5 h-5 text-accent" />
                </Link>
              </div>
            </div>
          </div>

          {/* We Care Like Family */}
          <div className="flex flex-col items-center md:border-l md:border-accent/40 md:pl-6">
            <h3 className="font-heading font-bold text-sm text-accent mb-3">WE CARE LIKE FAMILY</h3>
            <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-accent fill-accent" />
            </div>
            <p className="text-sm text-primary-foreground/70 text-center max-w-xs">
              Your loved ones are our priority, Their well-being is our mission.
            </p>
          </div>

          {/* Brand / Mission */}
          <div className="flex flex-col items-center md:items-end md:border-l md:border-accent/40 md:pl-6">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-3">
              <Home className="w-6 h-6 text-accent-foreground" />
            </div>
            <p className="text-sm text-primary-foreground/70 text-center md:text-right max-w-xs mb-4">
              Serving families across Liberia with dignity, compassion and excellence.
            </p>
            {user ?
            <Link to={dashboardPath} className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold rounded-full px-4 py-2 text-xs hover:opacity-90 transition">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link> :

            <Link to="/login" className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold rounded-full px-4 py-2 text-xs hover:opacity-90 transition">
                <LogIn className="w-4 h-4" /> Log in
              </Link>
            }
          </div>
        </div>
      </div>
      {/* Gold bottom strip */}
      <div className="bg-accent py-4 px-4">
        <p className="text-xs font-semibold tracking-wide text-accent-foreground text-center mb-2">
          FAMILY CARE WORKFORCE SOLUTIONS – CARE YOU CAN TRUST. FAMILY WE RESPECT.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[11px] text-accent-foreground/80">
          <span>© {new Date().getFullYear()} Family Care Workforce Solutions. All rights reserved.</span>
          <span className="hidden sm:inline">·</span>
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <span className="hidden sm:inline">·</span>
          <Link to="/terms-of-use" className="hover:underline">Terms of Use</Link>
        </div>
      </div>
    </footer>);

}
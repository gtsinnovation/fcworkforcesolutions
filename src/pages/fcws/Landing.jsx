import { Link } from "react-router-dom";
import {
  User, Utensils, Heart, Pill, ClipboardCheck, ShieldCheck,
  Phone, MapPin, Users, HeartHandshake, Home, Menu
} from "lucide-react";
import { SERVICE_CATALOG } from "@/lib/fcws";
import Footer from "@/components/fcws/Footer";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const SERVICE_ICONS = { User, Utensils, Heart, Pill, ClipboardCheck, ShieldCheck };

const TRUST_POINTS = [
  { icon: ShieldCheck, text: "Caregivers are screened, trained & background checked" },
  { icon: HeartHandshake, text: "Compassionate & respectful care" },
  { icon: Phone, text: "Regular updates & communication for peace of mind" },
  { icon: Users, text: "Reliable, professional & accountable" },
  { icon: MapPin, text: "Proudly Liberian, committed to our community" },
];

export default function Landing() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (authed) {
        base44.auth.me().then(setUser).catch(() => {});
      }
    });
  }, []);

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "caregiver" ? "/caregiver" : "/portal";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(var(--primary)) 35px, hsl(var(--primary)) 36px)' }}></div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 relative">
          {/* Gold vertical divider */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-accent rounded-full"></div>

          {/* Left: brand + headline */}
          <div className="flex flex-col px-6 lg:px-10 py-6 md:py-8 md:pr-8">
            {/* Top nav row */}
            <div className="flex items-center justify-end mb-3 md:mb-4">
              <div className="hidden md:flex items-center gap-5 text-xs font-medium text-muted-foreground">
                <Link to="/services" className="hover:text-accent transition-colors">Services</Link>
                <Link to="/about" className="hover:text-accent transition-colors">About</Link>
                <Link to="/careers" className="hover:text-accent transition-colors">Careers</Link>
              </div>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-primary">
                <Menu className="w-5 h-5" />
              </button>
            </div>
            {menuOpen && (
              <div className="md:hidden flex flex-col gap-3 mb-6 text-sm font-medium text-muted-foreground">
                <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
                <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                <Link to="/careers" onClick={() => setMenuOpen(false)}>Careers</Link>
              </div>
            )}

            {/* Hero image with all branding, headline & call-out text */}
            <div className="flex items-start mb-6 mt-1">
              <img
                src="https://media.base44.com/images/public/6a50456441d8a4a42f7c8722/ad1c9a309_designfc.jpg"
                alt="Family Care Workforce Solutions — Peace of Mind Every Day"
                className="w-full h-auto object-contain [object-position:top_left] rounded-lg"
              />
            </div>

            <Link to="/request-care" className="bg-accent text-accent-foreground font-semibold rounded-full px-6 py-2.5 hover:opacity-90 transition text-xs w-fit">Request Care</Link>
          </div>

          {/* Right: photo only */}
          <div className="relative min-h-[280px] md:min-h-[600px] bg-background overflow-hidden">
            <img
              src="https://media.base44.com/images/public/6a50456441d8a4a42f7c8722/a36d511c8_designclient.jpeg"
              alt="FCWS caregiver and client in conversation"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Gold separator */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-0.5 bg-accent"></div>
        </div>
      </div>

      {/* Services & Trust */}
      <section className="bg-background py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 relative">
            {/* Gold vertical divider between columns */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-accent/60 rounded-full"></div>
            {/* Our Services */}
            <div>
              <h2 className="font-heading font-bold text-lg md:text-xl text-primary mb-1">OUR SERVICES</h2>
              <div className="w-12 h-0.5 bg-accent mb-6" />
              <div>
                {SERVICE_CATALOG.map((service, idx) => {
                  const Icon = SERVICE_ICONS[service.icon] || Heart;
                  return (
                    <div key={service.slug}>
                      <Link to={`/services/${service.slug}`} className="flex items-center gap-3 py-2.5 group">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                          <Icon className="w-4 h-4 text-primary group-hover:text-accent-foreground transition-colors" />
                        </div>
                        <span className="text-sm text-foreground/80 group-hover:text-accent transition-colors">{service.title}</span>
                      </Link>
                      {idx < SERVICE_CATALOG.length - 1 && (
                        <div className="border-t border-dashed border-accent/40"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Why Families Trust FCWS */}
            <div>
              <h2 className="font-heading font-bold text-lg md:text-xl text-primary mb-1">WHY FAMILIES TRUST FCWS</h2>
              <div className="w-12 h-0.5 bg-accent mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {TRUST_POINTS.map((point, i) => {
                  const Icon = point.icon;
                  return (
                    <div key={i} className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-xs text-foreground/70 leading-snug">{point.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Banner */}
      <section className="bg-accent text-accent-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 text-center">
          <h2 className="font-heading font-bold text-base md:text-lg text-primary mb-2">
            RECOMMEND FCWS TO OTHER LIBERIANS IN THE DIASPORA
          </h2>
          <p className="text-sm text-primary/80 mb-1">Your referral can bring comfort and care to someone you love.</p>
          <p className="text-xs italic text-primary/60">Together, we care.</p>
        </div>
      </section>

      {/* Address Bar */}
      <section className="bg-background py-6">
        <div className="max-w-2xl mx-auto px-4">
          <a
            href="https://www.google.com/maps/search/?api=1&query=FDA+Community+Bernard's+Farm+Monrovia+Liberia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border border-border rounded-full px-6 py-3 shadow-sm hover:border-accent transition-colors"
          >
            <MapPin className="w-4 h-4 text-accent shrink-0" />
            <span className="text-sm text-foreground/80">FDA Community, Bernard's Farm, Monrovia, Liberia</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
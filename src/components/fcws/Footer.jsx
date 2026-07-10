import { Link } from "react-router-dom";
import { ShieldCheck, Phone, MapPin, MessageCircle } from "lucide-react";
import { SERVICE_CATALOG } from "@/lib/fcws";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand & Location */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="leading-tight">
                <span className="font-heading font-bold text-lg block">Family Care</span>
                <span className="text-xs text-accent">Workforce Solutions</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-accent mb-1">WE CARE LIKE FAMILY</p>
            <p className="text-xs text-primary-foreground/60 mb-4">
              Your loved ones are our priority, Their well-being is our mission.
            </p>
            <div className="flex items-start gap-2 text-sm text-primary-foreground/70">
              <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>FDA Community, Bernard's Farm, Monrovia, Liberia</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-accent">Services</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {SERVICE_CATALOG.map(s => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="hover:text-accent transition-colors">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-accent">WhatsApp / Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-accent" /> +231 88 898 87976</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> +231 76 143 5652</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-primary-foreground/20">
              <p className="text-xs text-primary-foreground/60">
                Serving families across Liberia with dignity, compassion and excellence.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Strip */}
      <div className="border-t border-primary-foreground/20 py-4 text-center">
        <p className="text-xs font-semibold tracking-wider text-primary-foreground/80">
          FAMILY CARE WORKFORCE SOLUTIONS – CARE YOU CAN TRUST. FAMILY WE RESPECT.
        </p>
      </div>
    </footer>
  );
}
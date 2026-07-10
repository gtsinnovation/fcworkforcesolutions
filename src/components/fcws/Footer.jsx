import { Link } from "react-router-dom";
import { ShieldCheck, Phone, Mail, MapPin } from "lucide-react";
import { SERVICE_CATALOG } from "@/lib/fcws";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <span className="font-heading font-bold text-lg">Family Care Workforce</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Compassionate, professional care services tailored to the unique needs of every family.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4 text-secondary">Services</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {SERVICE_CATALOG.map(s => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="hover:text-secondary transition-colors">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4 text-secondary">Company</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-secondary transition-colors">Careers</Link></li>
              <li><Link to="/quiz" className="hover:text-secondary transition-colors">Training Portal</Link></li>
              <li><Link to="/request-care" className="hover:text-secondary transition-colors">Request Care</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4 text-secondary">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-secondary" /> (555) 200-1800</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-secondary" /> care@fcws.org</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-secondary" /> 2200 Wellness Way, Care City</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Family Care Workforce Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
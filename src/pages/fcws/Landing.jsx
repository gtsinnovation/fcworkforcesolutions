import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Utensils, Heart, Pill, ClipboardCheck, ShieldCheck,
  Phone, Map, Users, HeartHandshake, ArrowRight, Menu
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
  { icon: Map, text: "Proudly Liberian, committed to our community" },
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero — Split layout with integrated navbar */}
      <section className="bg-primary relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2">
          {/* Left: nav + brand + headline */}
          <div className="flex flex-col px-6 lg:px-12 py-6 md:py-10 text-primary-foreground">
            {/* Top nav row */}
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="leading-tight">
                  <span className="font-heading font-extrabold text-base block">Family Care</span>
                  <span className="text-[10px] text-accent font-semibold tracking-wider">WORKFORCE SOLUTIONS</span>
                </div>
              </div>
              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-primary-foreground/80">
                <Link to="/services" className="hover:text-accent transition-colors">Services</Link>
                <Link to="/about" className="hover:text-accent transition-colors">About</Link>
                <Link to="/careers" className="hover:text-accent transition-colors">Careers</Link>
                <Link to="/quiz" className="hover:text-accent transition-colors">Training</Link>
                {user ? (
                  <Link to={user.role === "admin" ? "/admin" : user.role === "caregiver" ? "/caregiver" : "/portal"} className="bg-accent text-accent-foreground font-semibold rounded-full px-4 py-1.5 hover:opacity-90 transition text-sm">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/login" className="bg-accent text-accent-foreground font-semibold rounded-full px-4 py-1.5 hover:opacity-90 transition text-sm">
                    Log in
                  </Link>
                )}
              </div>
              {/* Mobile menu button */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-primary-foreground">
                <Menu className="w-6 h-6" />
              </button>
            </div>
            {/* Mobile nav dropdown */}
            {menuOpen && (
              <div className="md:hidden flex flex-col gap-3 mb-6 text-sm font-medium text-primary-foreground/80">
                <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
                <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                <Link to="/careers" onClick={() => setMenuOpen(false)}>Careers</Link>
                <Link to="/quiz" onClick={() => setMenuOpen(false)}>Training</Link>
                {user ? (
                  <Link to={user.role === "admin" ? "/admin" : user.role === "caregiver" ? "/caregiver" : "/portal"} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
                )}
              </div>
            )}

            <p className="text-xs text-accent font-semibold tracking-wider mb-2">Care You Can Trust. Family We Respect.</p>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              PEACE OF MIND<br />EVERY DAY
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/80 max-w-md mb-8">
              You may be far away, but your loved ones can still receive the love, care and support they deserve—right at home in Liberia. FCWS provides trusted, compassionate and professional caregivers so your family members are in <span className="text-accent font-semibold">safe hands</span>.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/request-care" className="bg-accent text-accent-foreground font-semibold rounded-full px-6 py-3 hover:opacity-90 transition text-sm">
                Request Care
              </Link>
              <Link to="/services" className="border border-primary-foreground/30 text-primary-foreground font-semibold rounded-full px-6 py-3 hover:bg-primary-foreground/10 transition text-sm">
                Our Services
              </Link>
            </div>
          </div>

          {/* Right: photo with badge */}
          <div className="relative min-h-[300px] md:min-h-[560px]">
            <img
              src="https://images.unsplash.com/photo-1559759175-0eb30cd8c128?w=1200&h=900&fit=crop"
              alt="Caregiver assisting a senior at home"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Top right badge */}
            <div className="absolute top-6 right-6 bg-primary/85 backdrop-blur-sm text-primary-foreground rounded-xl px-5 py-3 max-w-[200px]">
              <p className="font-heading font-bold text-sm leading-snug">CARING FOR YOUR LOVED ONES</p>
              <p className="text-xs text-accent italic mt-1">When you can't be there.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Trust — Two column split */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Our Services */}
            <div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2">OUR SERVICES</h2>
              <div className="w-16 h-1 bg-accent mb-8" />
              <div className="space-y-3">
                {SERVICE_CATALOG.map((service) => {
                  const Icon = SERVICE_ICONS[service.icon] || Heart;
                  return (
                    <motion.div
                      key={service.slug}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link
                        to={`/services/${service.slug}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent hover:shadow-md transition-all group"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                          <Icon className="w-5 h-5 text-primary-foreground group-hover:text-accent-foreground" />
                        </div>
                        <span className="font-medium text-primary group-hover:text-accent transition-colors text-sm md:text-base">{service.title}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-accent transition-colors" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right: Why Families Trust FCWS */}
            <div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2">WHY FAMILIES TRUST FCWS</h2>
              <div className="w-16 h-1 bg-accent mb-8" />
              <div className="space-y-5">
                {TRUST_POINTS.map((point, i) => {
                  const Icon = point.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-foreground/80 pt-2 text-sm md:text-base">{point.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-accent text-accent-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-3">
            RECOMMEND FCWS TO OTHER LIBERIANS IN THE DIASPORA
          </h2>
          <p className="text-primary/80 mb-2">
            Your referral can bring comfort and care to someone you love.
          </p>
          <p className="text-sm italic text-primary/60 mb-6">Together, we care.</p>
          <Link
            to="/request-care"
            className="inline-block bg-primary text-primary-foreground font-semibold rounded-full px-6 py-3 hover:opacity-90 transition text-sm"
          >
            Refer a Family
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
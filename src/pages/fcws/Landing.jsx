import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, ShieldCheck, Clock, Award, Phone, Users } from "lucide-react";
import { SERVICE_CATALOG } from "@/lib/fcws";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import { Button } from "@/components/ui/button";

const SERVICE_ICONS = { Heart, Home: () => <span>🏠</span>, Pill: () => <span>💊</span>, Users, Brain: () => <span>🧠</span>, Car: () => <span>🚗</span> };

const STATS = [
  { value: "500+", label: "Families Served" },
  { value: "120+", label: "Certified Caregivers" },
  { value: "24/7", label: "Care Available" },
  { value: "98%", label: "Satisfaction Rate" },
];

const VALUES = [
  { icon: ShieldCheck, title: "Trust & Safety", text: "Every caregiver is background-checked, bonded, and trained to the highest professional standards." },
  { icon: Heart, title: "Compassionate Care", text: "We treat every client like family, preserving dignity, independence, and quality of life." },
  { icon: Clock, title: "Flexible Scheduling", text: "From a few hours a week to 24/7 live-in care — we adapt to your family's needs." },
  { icon: Award, title: "Professional Excellence", text: "Our caregivers complete a rigorous 18-module training program with ongoing education." },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559759175-0eb30cd8c128?w=1600')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">Trusted Home Care Since 2008</span>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-background leading-tight mb-6">
              Compassionate Care for the People You Love
            </h1>
            <p className="text-lg text-background/80 mb-8 max-w-xl">
              Professional, personalized home care services that help your loved ones live with dignity, comfort, and independence — right at home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link to="/request-care">Request Care <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-heading font-bold text-3xl md:text-4xl text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-3">Our Care Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive, personalized care solutions designed around the unique needs of each individual and family.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATALOG.map((service, i) => {
            const Icon = SERVICE_ICONS[service.icon] || Heart;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="care-card group hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-primary mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-secondary hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-3">Why Families Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our commitment to excellence sets the standard for professional home care.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="care-card text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-heading font-semibold text-primary mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Contact us today for a free, no-obligation care consultation. Our care coordinators are here to help.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/request-care">Request Care</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <a href="tel:5552001800"><Phone className="w-4 h-4 mr-2" /> Call (555) 200-1800</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
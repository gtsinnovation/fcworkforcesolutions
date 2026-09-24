import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Phone, CheckCircle, Heart, User, Utensils, Pill, ClipboardCheck, ShieldCheck, Home, Brain, Moon, Clock, Baby, Users } from "lucide-react";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import { Button } from "@/components/ui/button";
import { SERVICE_CATALOG } from "@/lib/fcws";

const ICON_MAP = { User, Utensils, Heart, Pill, ClipboardCheck, ShieldCheck, Home, Brain, Moon, Clock, Baby, Users };

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICE_CATALOG.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="font-heading font-bold text-2xl text-primary mb-4">Service Not Found</h1>
          <Button asChild><Link to="/services">View All Services</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = ICON_MAP[service.icon] || Heart;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link to="/services" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> All Services
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-6">
            <Icon className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">{service.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{service.description}</p>

          <div className="care-card mb-8">
            <h2 className="font-heading font-semibold text-xl text-primary mb-4">What's Included</h2>
            <ul className="space-y-4">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-primary">{f.label}</span>
                    <p className="text-sm text-muted-foreground">{f.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="care-card bg-accent/5">
            <h2 className="font-heading font-semibold text-xl text-primary mb-2">Ready to Learn More?</h2>
            <p className="text-muted-foreground text-sm mb-6">Contact us for a free consultation about how {service.title.toLowerCase()} can help your family.</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/request-care">Request This Service <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline">
                <a href="tel:5552001800"><Phone className="w-4 h-4 mr-2" /> Call Us</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
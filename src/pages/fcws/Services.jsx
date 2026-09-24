import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User, Utensils, Heart, Pill, ClipboardCheck, ShieldCheck, Home, Brain, Moon, Clock } from "lucide-react";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import { SERVICE_CATALOG } from "@/lib/fcws";

const ICON_MAP = { User, Utensils, Heart, Pill, ClipboardCheck, ShieldCheck, Home, Brain, Moon, Clock };

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-3">Our Care Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive, personalized care solutions designed around the unique needs of each individual and family.</p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATALOG.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Heart;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="care-card group hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-primary mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
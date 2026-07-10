import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Phone, CheckCircle, Heart, Home, Pill, Users, Brain, Car } from "lucide-react";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import { Button } from "@/components/ui/button";
import { SERVICE_CATALOG } from "@/lib/fcws";

const ICON_MAP = { Heart, Home, Pill, Users, Brain, Car };

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
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
            <Icon className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">{service.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{service.description}</p>

          <div className="care-card mb-8">
            <h2 className="font-heading font-semibold text-xl text-primary mb-4">What's Included</h2>
            <ul className="space-y-3">
              {getFeatures(service.slug).map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="care-card bg-secondary/5">
            <h2 className="font-heading font-semibold text-xl text-primary mb-2">Ready to Learn More?</h2>
            <p className="text-muted-foreground text-sm mb-6">Contact us for a free consultation about how {service.title.toLowerCase()} can help your family.</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
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

function getFeatures(slug) {
  const features = {
    "personal-care": ["Bathing and showering assistance", "Grooming, hair and oral care", "Dressing and undressing", "Toileting and incontinence care", "Mobility and transfer assistance", "Skin care and comfort measures"],
    "homemaking": ["Light housekeeping and sanitization", "Laundry and linen changes", "Meal planning and preparation", "Grocery shopping and errands", "Plant and pet care", "Organization and clutter management"],
    "medication-reminders": ["Timely medication reminders", "Medication organization", "Coordination with pharmacy", "Health monitoring and logging", "Family communication updates", "Side effect observation"],
    "companionship": ["Friendly conversation and socializing", "Board games and cognitive activities", "Accompaniment to social events", "Reading aloud and shared hobbies", "Walks and light exercise", "Emotional support and companionship"],
    "dementia-care": ["Specialized dementia-trained caregivers", "Wandering prevention and safety", "Cognitive stimulation activities", "Consistent caregiver matching", "Behavioral management techniques", "Family education and support"],
    "transportation": ["Medical appointment transportation", "Grocery and pharmacy runs", "Social and community outings", "Religious service attendance", "Safe drop-off and pick-up", "Companion accompaniment"],
  };
  return features[slug] || ["Personalized care tailored to individual needs", "Flexible scheduling options", "Trained and screened caregivers", "Ongoing care plan adjustments"];
}
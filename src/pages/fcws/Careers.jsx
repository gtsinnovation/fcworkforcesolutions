import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import { Button } from "@/components/ui/button";
import { JOB_POSITIONS } from "@/lib/applications";

const BENEFITS = [
  { icon: GraduationCap, title: "Training", text: "Complete our 18-module certification program — fully paid." },
  { icon: Briefcase, title: "Flexible Schedules", text: "Choose shifts that work with your life — part-time or full-time." },
];

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">Build Your Career in Caregiving</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Join a team that values compassion, professionalism, and growth. We invest in our caregivers so they can provide the best possible care.</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {BENEFITS.map(b => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="care-card text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <h4 className="font-heading font-semibold text-primary mb-1">{b.title}</h4>
                <p className="text-sm text-muted-foreground">{b.text}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="font-heading font-bold text-2xl text-primary">Open Positions</h2>
          <Link to="/application-status" className="text-sm font-semibold text-secondary hover:underline">
            Already applied? Track your application status
          </Link>
        </div>
        <div className="space-y-4 mb-12">
          {JOB_POSITIONS.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="care-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-heading font-semibold text-lg text-primary">{p.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">{p.type}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{p.description}</p>
                <p className="text-xs text-muted-foreground/70">{p.location}</p>
              </div>
              <Button asChild variant="outline" className="shrink-0 border-secondary text-secondary hover:bg-secondary/10">
                <Link to={`/careers/apply?position=${encodeURIComponent(p.title)}`}>Apply Now <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="care-card bg-primary text-primary-foreground">
          <h3 className="font-heading font-bold text-xl mb-4">What Our Caregivers Say</h3>
          <div className="space-y-4">
            <div className="border-l-2 border-secondary pl-4">
              <p className="text-primary-foreground/80 italic text-sm mb-2">"The training program gave me confidence and skills I didn't have before. I feel proud of the work I do every day."</p>
              <p className="text-xs text-secondary">— Maria, Certified Caregiver since 2019</p>
            </div>
            <div className="border-l-2 border-secondary pl-4">
              <p className="text-primary-foreground/80 italic text-sm mb-2">"Flexible scheduling lets me balance work with my family. The team truly cares about us as people, not just employees."</p>
              <p className="text-xs text-secondary">— James, Weekend Caregiver</p>
            </div>
          </div>
        </div>

        <div className="care-card mt-8">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-semibold text-primary mb-2">Training & Certification</h3>
              <p className="text-sm text-muted-foreground mb-4">All new caregivers complete our comprehensive 18-module training program covering professional conduct, safety, infection control, emergency response, medication management, and dementia-specific care.</p>
              <Button asChild variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                <Link to="/quiz">Take the Knowledge Check</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
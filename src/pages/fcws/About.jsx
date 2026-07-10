import { motion } from "framer-motion";
import { ShieldCheck, Heart, Award, Users, Target, Eye } from "lucide-react";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">About Family Care Workforce Solutions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Dedicated to providing compassionate, professional care that empowers individuals to live with dignity and independence at home.</p>
        </motion.div>

        <div className="care-card mb-8">
          <p className="text-foreground leading-relaxed">
            Founded in 2008, Family Care Workforce Solutions began with a simple mission: to provide families with trustworthy, compassionate care for their loved ones. What started as a small team of dedicated caregivers has grown into a comprehensive care organization serving hundreds of families across the region.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Today, we combine time-honored caregiving values with modern training, technology, and care coordination to deliver exceptional service. Our caregivers complete a rigorous 18-module training program and ongoing education to ensure the highest quality of care.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="care-card">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-primary mb-2">Our Mission</h3>
            <p className="text-sm text-muted-foreground">To enhance the quality of life for individuals and families by delivering compassionate, professional, and personalized home care services that preserve dignity and promote independence.</p>
          </div>
          <div className="care-card">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-primary mb-2">Our Vision</h3>
            <p className="text-sm text-muted-foreground">To be the most trusted and respected home care provider in our community, known for excellence in caregiver training, client satisfaction, and innovative care solutions.</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          {[
            { icon: ShieldCheck, title: "Integrity", text: "We act with honesty and transparency in everything we do." },
            { icon: Heart, title: "Compassion", text: "We treat every client with the care we'd give our own family." },
            { icon: Award, title: "Excellence", text: "We hold ourselves to the highest professional standards." },
          ].map(v => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="care-card text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <h4 className="font-heading font-semibold text-primary mb-1">{v.title}</h4>
                <p className="text-sm text-muted-foreground">{v.text}</p>
              </div>
            );
          })}
        </div>

        <div className="care-card bg-primary text-primary-foreground text-center">
          <Users className="w-10 h-10 text-secondary mx-auto mb-4" />
          <h3 className="font-heading font-bold text-xl mb-2">Join Our Team</h3>
          <p className="text-primary-foreground/80 text-sm mb-6 max-w-md mx-auto">Are you a compassionate caregiver looking to make a difference? Explore career opportunities with us.</p>
          <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link to="/careers">View Careers</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
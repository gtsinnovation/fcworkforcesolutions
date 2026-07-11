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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Because peace of mind should never depend on distance.</p>
        </motion.div>

        <div className="care-card mb-8">
          <h2 className="font-heading font-bold text-xl text-primary mb-4">How We Got Here</h2>
          <p className="text-foreground leading-relaxed">
            Family Care Workforce Solutions (FCWS) was born from a personal wake-up call.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            While visiting my elderly mother in Liberia, I asked to see her medications. To my surprise, I found expired pills, unlabeled bottles, and different tablets mixed together. We immediately organized her care, but two years later, she experienced a sudden medical emergency. By God's grace, family members were nearby and responded quickly. That terrifying moment made us realize just how vulnerable our loved ones can be without consistent, professional support.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            But we quickly realized this vulnerability isn't unique to the elderly. Working parents struggle to find trustworthy childcare. Individuals recovering at home or living with disabilities lack daily, compassionate assistance. At the same time, thousands of capable young people and women in Liberia are searching for meaningful work but lack access to professional training.
          </p>
          <p className="text-foreground leading-relaxed mt-4">
            FCWS was founded to bridge these two critical needs: providing trusted, non-medical care for families while creating sustainable careers through professional caregiver training and workforce development.
          </p>
          <p className="text-foreground leading-relaxed mt-4 font-medium">
            Whether a family lives next door or thousands of miles away, FCWS ensures their loved ones receive safe, dignified, and professional care from people they can trust.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="care-card">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-primary mb-2">Our Mission</h3>
            <p className="text-sm text-muted-foreground">To enrich lives by providing trusted, compassionate, non-medical home care and household support services, while empowering Liberian youth and women through professional certification, job creation, and workforce development.</p>
          </div>
          <div className="care-card">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-primary mb-2">Our Vision</h3>
            <p className="text-sm text-muted-foreground">To be Liberia's premier family care and workforce development organization—transforming lives through professional training, creating rewarding careers, and ensuring every family has access to dependable, dignified care.</p>
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
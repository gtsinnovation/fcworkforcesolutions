import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { SERVICE_CATALOG } from "@/lib/fcws";
import EmailVerificationDialog from "@/components/fcws/EmailVerificationDialog";

export default function RequestCare() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pendingLead, setPendingLead] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    setPendingLead({
      fullName: formData.get("fullName"),
      email: String(formData.get("email") || "").trim(),
      phone: formData.get("phone"),
      serviceInterest: formData.get("serviceInterest") || "General inquiry",
      serviceDateRange: formData.get("serviceDateRange") || "",
      message: formData.get("message") || "",
    });
  };

  const submitVerifiedRequest = async () => {
    const leadData = pendingLead;
    setPendingLead(null);
    setSubmitting(true);
    setError("");
    try {
      const res = await base44.functions.invoke("submitCareRequest", leadData);
      if (res.data?.error) throw new Error(res.data.error);
      setSubmitted(true);
      formRef.current?.reset();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        {submitted ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="care-card text-center py-16">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-primary mb-3">Thank You — Request Received!</h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Our care coordination team will reach out within 24 hours to discuss your family's needs and schedule a free consultation.
            </p>
            <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/">Return Home</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-3">Request Care Services</h1>
            <p className="text-muted-foreground mb-8">Tell us about your loved one's needs and we'll get back to you within 24 hours for a free consultation.</p>

            <form ref={formRef} onSubmit={handleSubmit} className="care-card space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" name="fullName" required placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" required placeholder="(555) 123-4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceInterest">Service of Interest</Label>
                <Select name="serviceInterest">
                  <SelectTrigger id="serviceInterest"><SelectValue placeholder="Select a service" /></SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATALOG.map(s => <SelectItem key={s.slug} value={s.title}>{s.title}</SelectItem>)}
                    <SelectItem value="General inquiry">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceDateRange">Caregiver Service Date Range</Label>
                <Select name="serviceDateRange">
                  <SelectTrigger id="serviceDateRange"><SelectValue placeholder="Select a duration" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 month or less">1 month or less</SelectItem>
                    <SelectItem value="2 month">2 month</SelectItem>
                    <SelectItem value="Undecided">Undecided</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Tell us about your needs</Label>
                <Textarea id="message" name="message" rows={4} placeholder="Describe the type of care needed, schedule preferences, and any specific requirements..." />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={submitting} className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Request"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                We'll email a 6-digit code to confirm your address before your request is sent.
              </p>
            </form>

            <EmailVerificationDialog
              open={!!pendingLead}
              email={pendingLead?.email || ""}
              name={pendingLead?.fullName || ""}
              onVerified={submitVerifiedRequest}
              onClose={() => setPendingLead(null)}
            />
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
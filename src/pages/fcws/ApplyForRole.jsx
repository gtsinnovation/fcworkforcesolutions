import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import ApplicationForm from "@/components/fcws/ApplicationForm";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ClipboardList } from "lucide-react";

export default function ApplyForRole() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const initialPosition = searchParams.get("position") || "";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex-1">
        {submitted ? (
          <div className="care-card text-center">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-secondary" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-primary mb-2">Application Received</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Thank you, {submitted.fullName}. Our team will review your application for{" "}
              <span className="font-semibold text-foreground">{submitted.position}</span> and contact you at{" "}
              {submitted.email}.
            </p>

            <div className="inline-block rounded-xl border-2 border-dashed border-accent/60 bg-accent/5 px-8 py-4 mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Your reference code</p>
              <p className="font-mono font-bold text-xl tracking-wider text-primary break-all">{submitted.lookupCode}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Save this code — you'll need it to check your application status.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link to={`/application-status?code=${encodeURIComponent(submitted.lookupCode)}`}>
                  Track My Application
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/careers">Back to Careers</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="font-heading font-bold text-3xl text-primary mb-2">Caregiver Job Application</h1>
              <p className="text-muted-foreground">
                Tell us about yourself and the role you'd like to take on. It takes about two minutes.
              </p>
            </div>

            <div className="care-card">
              <ApplicationForm user={user} initialPosition={initialPosition} onSubmitted={setSubmitted} />
            </div>

            <div className="care-card mt-6 flex items-start gap-3">
              <ClipboardList className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-heading font-semibold text-primary mb-1">Already applied?</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Use your reference code to see where your application stands.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/application-status">Track Application Status</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import ApplicationStatusTracker from "@/components/fcws/ApplicationStatusTracker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, Loader2, Search } from "lucide-react";

export default function ApplicationStatus() {
  const [searchParams] = useSearchParams();
  const [myApplications, setMyApplications] = useState([]);
  const [loadingMine, setLoadingMine] = useState(true);
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [looking, setLooking] = useState(false);

  useEffect(() => {
    let active = true;
    base44.auth.me()
      .then(() => base44.entities.JobApplication.list("-created_date"))
      .then((list) => { if (active) setMyApplications(list); })
      .catch(() => {})
      .finally(() => { if (active) setLoadingMine(false); });
    return () => { active = false; };
  }, []);

  async function runLookup(rawCode) {
    const value = String(rawCode || "").trim();
    if (!value) {
      setLookupError("Enter the reference code from your application.");
      return;
    }
    setLooking(true);
    setLookupError("");
    setResult(null);
    try {
      const res = await base44.functions.invoke("lookupApplication", { code: value });
      const list = res.data?.applications || [];
      if (list.length > 0) setResult(list[0]);
      else setLookupError("No application found for that reference code. Please check it and try again.");
    } catch (err) {
      setLookupError("We couldn't look up that reference code right now. Please try again.");
    } finally {
      setLooking(false);
    }
  }

  useEffect(() => {
    const initialCode = searchParams.get("code");
    if (initialCode) {
      setCode(initialCode);
      runLookup(initialCode);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex-1">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-primary mb-2">Application Status</h1>
          <p className="text-muted-foreground">
            Check where your caregiver application stands. Enter the reference code you received when you applied.
          </p>
        </div>

        <div className="care-card mb-8">
          <form
            onSubmit={(e) => { e.preventDefault(); runLookup(code); }}
            className="flex flex-col sm:flex-row sm:items-end gap-4"
          >
            <div className="space-y-2 flex-1">
              <Label htmlFor="code">Reference Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. 4F9A2C7D1B8E5036"
                className="font-mono"
              />
            </div>
            <Button type="submit" disabled={looking} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:w-auto w-full">
              {looking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking…
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" /> Check Status
                </>
              )}
            </Button>
          </form>
          {lookupError && <p className="text-sm text-destructive font-medium mt-3">{lookupError}</p>}
        </div>

        {result && (
          <div className="mb-8">
            <h2 className="font-heading font-bold text-xl text-primary mb-4">Application Found</h2>
            <ApplicationStatusTracker application={result} />
          </div>
        )}

        {loadingMine ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" />
          </div>
        ) : myApplications.length > 0 ? (
          <div>
            <h2 className="font-heading font-bold text-xl text-primary mb-4">Your Applications</h2>
            <div className="space-y-6">
              {myApplications.map((app) => (
                <ApplicationStatusTracker key={app.id} application={app} />
              ))}
            </div>
          </div>
        ) : (
          <div className="care-card text-center py-10">
            <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              No applications are linked to your account yet. Submitting an application is quick and needs no CV.
            </p>
            <Button asChild variant="outline">
              <Link to="/careers/apply">Apply for a Caregiver Role</Link>
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
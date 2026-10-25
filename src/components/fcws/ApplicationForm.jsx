import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { JOB_POSITIONS, generateLookupCode } from "@/lib/applications";

const SELECT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export default function ApplicationForm({ user, initialPosition, onSubmitted }) {
  const [form, setForm] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    city: "",
    position: initialPosition || JOB_POSITIONS[0].title,
    yearsExperience: "",
    experience: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.city.trim() || !form.experience.trim()) {
      setError("Please complete all required fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.yearsExperience === "" || Number(form.yearsExperience) < 0) {
      setError("Please enter your years of caregiving experience.");
      return;
    }

    setSubmitting(true);
    try {
      const lookupCode = generateLookupCode();
      const email = form.email.trim().toLowerCase();

      await base44.entities.JobApplication.create({
        fullName: form.fullName.trim(),
        email,
        phone: form.phone.trim(),
        city: form.city.trim(),
        position: form.position,
        yearsExperience: Number(form.yearsExperience),
        experience: form.experience.trim(),
        lookupCode,
        applicantUserId: user?.id || "",
      });

      onSubmitted({
        fullName: form.fullName.trim(),
        email,
        position: form.position,
        lookupCode,
      });
    } catch (err) {
      setError("We couldn't submit your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input id="fullName" value={form.fullName} onChange={set("fullName")} placeholder="Jane Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input id="phone" value={form.phone} onChange={set("phone")} placeholder="+231 77 000 0000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City / Town *</Label>
          <Input id="city" value={form.city} onChange={set("city")} placeholder="Monrovia" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Role Applying For *</Label>
          <select id="position" className={SELECT_CLASS} value={form.position} onChange={set("position")}>
            {JOB_POSITIONS.map((p) => (
              <option key={p.title} value={p.title}>
                {p.title} — {p.type}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearsExperience">Years of Experience *</Label>
          <Input
            id="yearsExperience"
            type="number"
            min="0"
            max="60"
            value={form.yearsExperience}
            onChange={set("yearsExperience")}
            placeholder="3"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Caregiving Experience *</Label>
        <Textarea
          id="experience"
          rows={5}
          value={form.experience}
          onChange={set("experience")}
          placeholder="Tell us who you've cared for, the duties you handled, and any training or certificates you hold."
        />
      </div>

      <p className="text-xs text-muted-foreground">
        No CV or resume upload is needed. After you submit, you'll receive a reference code to track your application status.
      </p>

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" /> Submit Application
          </>
        )}
      </Button>
    </form>
  );
}
import { useState } from "react";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import { Mail, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
            <Mail className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-primary">Contact Us</h1>
            <p className="text-sm text-muted-foreground">Send us a message and we'll get back to you.</p>
          </div>
        </div>

        {submitted ? (
          <div className="care-card text-center py-12">
            <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="font-heading font-bold text-lg text-primary mb-2">Message Sent!</h2>
            <p className="text-sm text-muted-foreground">Thank you for reaching out. We'll respond shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="care-card space-y-5">
            <input type="hidden" name="access_key" value="d32ecb38-0808-4916-a056-91989c835aad" />
            <input type="hidden" name="from_name" value="FCWS Website Contact Form" />
            <div>
              <label className="block text-sm font-semibold text-primary mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1.5">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="How can we help you?"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Submit"}
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
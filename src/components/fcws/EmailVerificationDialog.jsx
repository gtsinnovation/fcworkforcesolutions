import { useState, useEffect } from "react";
import { Mail, Loader2, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";

const errorText = (err, fallback) =>
  err?.response?.data?.error || err?.message || fallback;

export default function EmailVerificationDialog({ open, email, name, onVerified, onClose }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const sendCode = async () => {
    setSending(true);
    setError("");
    try {
      const res = await base44.functions.invoke("sendRequestCode", { email, name });
      if (res.data?.error) throw { response: res };
      setSent(true);
      setCooldown(60);
    } catch (err) {
      setError(errorText(err, "We couldn't send the code. Please try again."));
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setCode("");
    setSent(false);
    setError("");
    setCooldown(0);
    sendCode();
  }, [open, email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setError("");
    try {
      const res = await base44.functions.invoke("verifyRequestCode", { email, code: code.trim() });
      if (res.data?.verified) {
        onVerified();
      } else {
        setError(res.data?.error || "That code isn't valid. Please try again.");
      }
    } catch (err) {
      setError(errorText(err, "That code isn't valid. Please try again."));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <DialogTitle className="font-heading text-primary">Verify your email to send your request</DialogTitle>
          <DialogDescription>
            {sending
              ? "Sending a 6-digit code…"
              : `Enter the 6-digit code we sent to ${email}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-primary">
          <Mail className="w-4 h-4 text-secondary shrink-0" />
          <span className="truncate">{email}</span>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 mt-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            className="text-center text-xl tracking-[0.5em] h-12"
            aria-label="Verification code"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={verifying || code.length !== 6 || sending}
            className="w-full h-11 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {verifying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying…</> : "Verify & Send Request"}
          </Button>
        </form>

        <div className="text-center text-sm">
          {cooldown > 0 ? (
            <span className="text-muted-foreground">Didn't get it? You can resend in {cooldown}s.</span>
          ) : (
            <button type="button" onClick={sendCode} disabled={sending} className="font-semibold text-secondary hover:underline disabled:opacity-60">
              {sending ? "Sending…" : "Resend code"}
            </button>
          )}
        </div>
        {sent && !error && (
          <p className="text-xs text-muted-foreground text-center">
            Check your inbox and spam folder. The code expires in 10 minutes.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
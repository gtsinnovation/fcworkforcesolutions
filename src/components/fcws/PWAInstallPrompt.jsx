import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

const isStandalone =
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true);

const isMobile =
  typeof window !== "undefined" &&
  (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.matchMedia("(max-width: 768px)").matches);

export default function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (isStandalone) return;

    // iOS doesn't fire beforeinstallprompt — show a manual instructions banner
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    const dismissed = sessionStorage.getItem("pwa_prompt_dismissed");
    if (dismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // For iOS, show after a brief delay
    if (ios) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
        clearTimeout(timer);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted" || outcome === "dismissed") {
        setShow(false);
        setDeferredPrompt(null);
      }
    } else {
      setShow(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!show || !isMobile) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-primary text-primary-foreground rounded-2xl shadow-xl border border-accent/30 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm mb-1">Install Family Care App</p>
          <p className="text-xs text-primary-foreground/70 mb-3">
            {isIOS
              ? "Tap Share, then 'Add to Home Screen' for quick access."
              : "Add to your home screen for a faster, app-like experience."}
          </p>
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="bg-accent text-accent-foreground font-semibold rounded-full px-4 py-1.5 text-xs hover:opacity-90 transition"
            >
              Install Now
            </button>
          )}
        </div>
        <button onClick={handleDismiss} className="text-primary-foreground/50 hover:text-primary-foreground transition shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
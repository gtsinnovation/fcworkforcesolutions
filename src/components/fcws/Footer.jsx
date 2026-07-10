import { Home, MessageCircle, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-3 text-center md:text-left">
          {/* WhatsApp / Contact */}
          <div>
            <h3 className="font-heading font-bold text-sm text-accent mb-4">WHATSAPP / CONTACT</h3>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-accent" />
              <MessageCircle className="w-4 h-4 text-accent" />
              <MessageCircle className="w-4 h-4 text-accent" />
            </div>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>+231 88 898 87976</li>
              <li>+231 76 143 5652</li>
            </ul>
          </div>

          {/* We Care Like Family */}
          <div className="flex flex-col items-center">
            <h3 className="font-heading font-bold text-sm text-accent mb-3">WE CARE LIKE FAMILY</h3>
            <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-accent fill-accent" />
            </div>
            <p className="text-sm text-primary-foreground/70 text-center max-w-xs">
              Your loved ones are our priority, Their well-being is our mission.
            </p>
          </div>

          {/* Brand / Mission */}
          <div className="flex flex-col items-center md:items-end">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-3">
              <Home className="w-6 h-6 text-accent-foreground" />
            </div>
            <p className="text-sm text-primary-foreground/70 text-center md:text-right max-w-xs">
              Serving families across Liberia with dignity, compassion and excellence.
            </p>
          </div>
        </div>
      </div>
      {/* Gold bottom strip */}
      <div className="bg-accent py-3 text-center">
        <p className="text-xs font-semibold tracking-wide text-accent-foreground">
          FAMILY CARE WORKFORCE SOLUTIONS – CARE YOU CAN TRUST. FAMILY WE RESPECT.
        </p>
      </div>
    </footer>
  );
}
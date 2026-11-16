import { useState } from "react";
import { Check, Copy, Facebook, Linkedin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const NETWORKS = [
  {
    key: "facebook",
    label: "Facebook",
    icon: Facebook,
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: "x",
    label: "X",
    icon: null,
    href: (url, text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: null,
    href: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
];

export default function ShareBar({ title, url }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) await navigator.share({ title, url });
    else copy();
  };

  const openShare = (build) => {
    window.open(build(url, title), "_blank", "noopener,noreferrer,width=640,height=560");
  };

  return (
    <div className="mt-10 pt-6 border-t border-border">
      <p className="text-sm font-semibold text-primary mb-3">Share this article</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={copy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Link copied" : "Copy link"}
        </Button>
        {NETWORKS.map((network) => (
          <Button key={network.key} size="sm" variant="outline" onClick={() => openShare(network.href)}>
            {network.icon ? (
              <network.icon className="w-4 h-4" />
            ) : (
              <span className="text-xs font-bold">{network.label === "X" ? "𝕏" : "WA"}</span>
            )}
            {network.label}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={nativeShare}>
          <Share2 className="w-4 h-4" /> Share…
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-3 break-all">{url}</p>
    </div>
  );
}
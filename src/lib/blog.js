export const BLOG_CATEGORIES = [
  "Caregiving Tips",
  "Family Support",
  "Hiring & Careers",
  "Company News",
];

export const CATEGORY_STYLES = {
  "Caregiving Tips": "bg-secondary/10 text-secondary",
  "Family Support": "bg-primary/10 text-primary",
  "Hiring & Careers": "bg-accent/15 text-accent",
  "Company News": "bg-muted text-muted-foreground",
};

export const POST_STATUS = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  pending: { label: "Awaiting admin approval", className: "bg-accent/15 text-accent" },
  published: { label: "Published", className: "bg-secondary/10 text-secondary" },
  rejected: { label: "Changes requested", className: "bg-destructive/10 text-destructive" },
};

export function readingTime(content) {
  const words = String(content || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatPostDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function postUrl(slug) {
  return `/caregiving-insight/${slug}`;
}
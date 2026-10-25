export const JOB_POSITIONS = [
  { title: "Certified Caregiver", type: "Full-time", location: "Care City & Surrounding Areas", description: "Provide personal care, companionship, and household support to clients in their homes." },
  { title: "Weekend Caregiver", type: "Part-time", location: "Multiple Locations", description: "Support clients with weekend care needs including personal care and companionship." },
  { title: "Live-in Caregiver", type: "Full-time", location: "Regional", description: "Provide 24/7 care and support for clients requiring continuous assistance." },
];

export const APPLICATION_STATUS = {
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500", message: "We received your application and it's queued for review." },
  reviewing: { label: "Under Review", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500", message: "Our team is reviewing your details and experience." },
  shortlisted: { label: "Shortlisted", color: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500", message: "You've been shortlisted — expect a call from our team soon." },
  interviewed: { label: "Interview", color: "bg-purple-100 text-purple-700", dot: "bg-purple-500", message: "Your interview stage is in progress." },
  hired: { label: "Hired", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", message: "Welcome to the team! We'll be in touch about onboarding." },
  not_selected: { label: "Not Selected", color: "bg-red-100 text-red-700", dot: "bg-red-500", message: "We're not moving forward with this application." },
};

export const APPLICATION_STATUS_ORDER = [
  "submitted",
  "reviewing",
  "shortlisted",
  "interviewed",
  "hired",
  "not_selected",
];

export const APPLICATION_FLOW = ["submitted", "reviewing", "shortlisted", "interviewed", "hired"];

export function statusInfo(key) {
  return APPLICATION_STATUS[key] || APPLICATION_STATUS.submitted;
}

export function generateLookupCode() {
  return crypto.randomUUID().replace(/-/g, "").toUpperCase().slice(0, 16);
}
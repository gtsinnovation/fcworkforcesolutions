export const SERVICE_CATALOG = [
  { slug: "personal-care", title: "Personal Care & Hygiene", icon: "Heart", description: "Assistance with bathing, grooming, dressing, and toileting while preserving dignity and privacy." },
  { slug: "homemaking", title: "Homemaking & Household Support", icon: "Home", description: "Light housekeeping, laundry, meal preparation, and household management to maintain a safe living environment." },
  { slug: "medication-reminders", title: "Medication Reminders", icon: "Pill", description: "Trained caregivers provide timely medication reminders and coordinate with healthcare providers." },
  { slug: "companionship", title: "Companionship & Social Engagement", icon: "Users", description: "Meaningful social interaction, conversation, and activities that support emotional well-being." },
  { slug: "dementia-care", title: "Dementia & Alzheimer's Care", icon: "Brain", description: "Specialized care techniques and safety protocols tailored to clients with cognitive impairments." },
  { slug: "transportation", title: "Transportation & Errands", icon: "Car", description: "Safe transportation to medical appointments, grocery shopping, and community activities." },
];

export const SERVICE_SLUGS = SERVICE_CATALOG.map(s => s.slug);

export const HIRING_STATUS_LABELS = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  screening: { label: "Screening", color: "bg-blue-100 text-blue-700" },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
};

export const SEVERITY_LABELS = {
  Low: { label: "Low", color: "bg-emerald-100 text-emerald-700" },
  Medium: { label: "Medium", color: "bg-amber-100 text-amber-700" },
  High: { label: "High", color: "bg-red-100 text-red-700" },
};
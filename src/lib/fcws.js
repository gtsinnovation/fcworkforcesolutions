export const SERVICE_CATALOG = [
  { slug: "personal-care", title: "Personal Care & Daily Living Assistance", icon: "User", description: "Compassionate assistance with bathing, grooming, dressing, and daily living activities while preserving dignity and independence." },
  { slug: "meal-preparation", title: "Meal Preparation & Nutrition Support", icon: "Utensils", description: "Nutritious meal planning and preparation tailored to dietary needs and preferences, ensuring your loved ones eat well every day." },
  { slug: "companionship", title: "Companionship & Emotional Support", icon: "Heart", description: "Meaningful social interaction, conversation, and emotional support that combats loneliness and enriches daily life." },
  { slug: "medication-reminders", title: "Medication Reminders", icon: "Pill", description: "Timely medication reminders and coordination with healthcare providers to ensure prescriptions are taken correctly and safely." },
  { slug: "light-housekeeping", title: "Light Housekeeping & Errands", icon: "ClipboardCheck", description: "Light housekeeping, laundry, grocery shopping, and errands to maintain a clean, safe, and comfortable living environment." },
  { slug: "respite-care", title: "Respite Care for Family Caregivers", icon: "ShieldCheck", description: "Temporary relief for family caregivers, providing professional care while you rest, recharge, or attend to other responsibilities." },
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
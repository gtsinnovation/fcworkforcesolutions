export const SERVICE_CATALOG = [
  {
    slug: "companionship-homemaker",
    title: "Companionship & Homemaker Package",
    icon: "Home",
    description: "Designed for individuals who are largely independent but need basic help around the house and social interaction.",
    features: [
      { label: "Light Housekeeping", detail: "Laundry, changing bed linens, dusting, vacuuming, and washing dishes." },
      { label: "Meal Planning & Prep", detail: "Grocery shopping, cooking, and meal cleanup." },
      { label: "Errands", detail: "Running errands, picking up groceries, and other personal tasks." },
      { label: "Engagement", detail: "Friendly conversation, games, reading, and walks." },
      { label: "Medication Reminders", detail: "Prompting to take prescribed medications on schedule (without administering)." },
    ],
  },
  {
    slug: "personal-care",
    title: "Personal Care Package",
    icon: "User",
    description: "Designed for clients who need direct, physical assistance with Activities of Daily Living (ADLs). Includes all Companion/Homemaker services plus direct personal care.",
    features: [
      { label: "Personal Hygiene", detail: "Bathing, showering, bed baths, hair care, and dental hygiene." },
      { label: "Dressing & Grooming", detail: "Assistance with selecting clothing, dressing, and shaving." },
      { label: "Mobility & Transfers", detail: "Safe assistance moving between bed, wheelchair, or walker, and fall prevention." },
      { label: "Toileting & Incontinence", detail: "Assistance with restroom use and changing adult protective garments." },
    ],
  },
  {
    slug: "respite-care",
    title: "Respite Care Package",
    icon: "ShieldCheck",
    description: "Designed to provide temporary relief for primary family caregivers to prevent burnout.",
    features: [
      { label: "Flexible Scheduling", detail: "Hourly, half-day, overnight, or weekend coverage." },
      { label: "Comprehensive Coverage", detail: "Covers personal care, meals, and safety monitoring while family members travel, work, or take time to rest." },
    ],
  },
  {
    slug: "hospital-to-home-transition",
    title: "Hospital-to-Home Transition Package",
    icon: "Heart",
    description: "A short-term, intensive package designed to help clients recover safely at home following surgery or hospital discharge.",
    features: [
      { label: "Recovery Support", detail: "Assistance following joint replacements, cardiac procedures, or major illnesses." },
      { label: "Discharge Follow-Through", detail: "Picking up prescription medications, stocking the pantry, and setting up comfortable recovery areas." },
      { label: "Mobility & Fall Mitigation", detail: "Close supervision during movement and assistance with non-clinical exercises recommended by physical therapists." },
    ],
  },
  {
    slug: "memory-dementia-care",
    title: "Memory & Dementia Care Package",
    icon: "Brain",
    description: "Specialized non-medical support for individuals experiencing Alzheimer's, dementia, or cognitive decline.",
    features: [
      { label: "Structured Daily Routines", detail: "Maintaining predictable habits to reduce anxiety and confusion." },
      { label: "Cognitive Exercises", detail: "Puzzles, memory activities, and gentle redirection." },
      { label: "Safety & Wandering Prevention", detail: "Continuous supervision to prevent clients from leaving the home unattended or engaging in unsafe tasks." },
    ],
  },
  {
    slug: "overnight-nightwatch",
    title: "Overnight or Nightwatch Package",
    icon: "Moon",
    description: "Focused on safety and support during nighttime hours.",
    features: [
      { label: "Bedtime Routine", detail: "Assistance with evening hygiene, undressing, and settling in safely." },
      { label: "Nighttime Monitoring", detail: "Assistance with late-night restroom visits, managing disorientation, and monitoring sleep disturbances." },
      { label: "Morning Prep", detail: "Help getting out of bed and preparing breakfast." },
    ],
  },
  {
    slug: "24-7-live-in-care",
    title: "24/7 or Live-In Care Package",
    icon: "Clock",
    description: "Round-the-clock coverage for clients who require continuous supervision and hands-on help.",
    features: [
      { label: "Shift Rotation (24/7)", detail: "Multiple caregivers working sequential 8- or 12-hour shifts for constant awake coverage." },
      { label: "Live-In Care", detail: "A primary caregiver resides in the home to provide ongoing daily assistance and nighttime availability (requiring a private room and dedicated sleep time)." },
    ],
  },
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
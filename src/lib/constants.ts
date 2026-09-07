export const ROLES = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
} as const;

export const PROVIDER_TYPES = {
  INDIVIDUAL: {
    value: "INDIVIDUAL",
    label: "Individual Technician",
    description: "Independent skilled worker/technician without a formal company or shop.",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  SHOP: {
    value: "SHOP",
    label: "Professional Shop",
    description: "Physical local shop or service counter.",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
  },
  COMPANY: {
    value: "COMPANY",
    label: "Service Company",
    description: "Formal business with teams, staff, or multiple service areas.",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  CONTRACTOR: {
    value: "CONTRACTOR",
    label: "Contractor / Team",
    description: "Team or contractor responsible for larger jobs and construction projects.",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
  },
} as const;

export const AVAILABILITY_STATUS = {
  AVAILABLE: {
    value: "AVAILABLE",
    label: "Available Now",
    color: "bg-green-500",
    textClass: "text-green-700 bg-green-50 border-green-200",
  },
  ACCEPTING: {
    value: "ACCEPTING",
    label: "Accepting New Projects",
    color: "bg-blue-500",
    textClass: "text-blue-700 bg-blue-50 border-blue-200",
  },
  BUSY: {
    value: "BUSY",
    label: "Busy / Booked This Week",
    color: "bg-amber-500",
    textClass: "text-amber-700 bg-amber-50 border-amber-200",
  },
  UNAVAILABLE: {
    value: "UNAVAILABLE",
    label: "Temporarily Unavailable",
    color: "bg-gray-400",
    textClass: "text-gray-700 bg-gray-50 border-gray-200",
  },
} as const;

export const VERIFICATION_TYPES = {
  PHONE: { label: "Phone Verified", icon: "Phone", description: "Phone ownership verified" },
  IDENTITY: { label: "Identity Verified", icon: "ShieldCheck", description: "Government ID verified by admin" },
  LOCATION: { label: "Location Verified", icon: "MapPin", description: "Physical address / locality verified" },
  EXPERIENCE: { label: "Experience Verified", icon: "Briefcase", description: "Work tenure and track record verified" },
  WORK: { label: "Work Evidence Verified", icon: "CheckCircle2", description: "Completed project evidence vetted" },
  CUSTOMER: { label: "Customer Reference Verified", icon: "Users", description: "Past client references verified" },
  BUSINESS: { label: "Business Verified", icon: "Building", description: "Business registration/GST verified" },
} as const;

export const TRUST_LEVELS = [
  { min: 90, max: 100, label: "Highly Trusted", color: "text-emerald-700 bg-emerald-50 border-emerald-300 ring-emerald-500/20" },
  { min: 75, max: 89, label: "Trusted", color: "text-blue-700 bg-blue-50 border-blue-300 ring-blue-500/20" },
  { min: 60, max: 74, label: "Good", color: "text-amber-700 bg-amber-50 border-amber-300 ring-amber-500/20" },
  { min: 40, max: 59, label: "Limited History", color: "text-slate-700 bg-slate-50 border-slate-300 ring-slate-500/20" },
  { min: 0, max: 39, label: "New Provider", color: "text-gray-600 bg-gray-50 border-gray-200 ring-gray-500/10" },
] as const;

export function getTrustLevel(score: number) {
  return TRUST_LEVELS.find((lvl) => score >= lvl.min) || TRUST_LEVELS[TRUST_LEVELS.length - 1];
}

export const COMPLAINT_CATEGORIES = {
  FAKE_IDENTITY: "Fake Identity or Impersonation",
  FAKE_BUSINESS: "Fake Business / Address",
  FAKE_PORTFOLIO: "Fake Portfolio / Work Evidence",
  FAKE_REVIEWS: "Fabricated / Coerced Reviews",
  FRAUD: "Financial Fraud / Advance Taken & Fled",
  POOR_BEHAVIOUR: "Unprofessional or Harassing Behavior",
  POOR_QUALITY: "Severe Workmanship Failure",
} as const;

export const DEFAULT_CITY = "Dehradun";

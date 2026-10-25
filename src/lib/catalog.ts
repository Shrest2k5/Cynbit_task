export type ProjectType =
  | "ai-automation"
  | "web-platform"
  | "mobile-app"
  | "cloud-migration"
  | "growth-seo";

export type Industry =
  | "healthcare"
  | "retail"
  | "fintech"
  | "education"
  | "events"
  | "media"
  | "other";

export type FeatureId =
  | "auth"
  | "payments"
  | "realtime"
  | "ai-agent"
  | "analytics"
  | "integrations"
  | "admin"
  | "iot-ar";

export interface ProjectTypeInfo {
  id: ProjectType;
  label: string;
  blurb: string;
  baseWeeks: number;
  stack: string[];
}

export interface FeatureInfo {
  id: FeatureId;
  label: string;
  weeks: number;
  stack: string[];
}

export interface BudgetBand {
  id: string;
  label: string;
  min: number; // INR
  max: number; // INR (Infinity for open-ended)
}

export interface TimelineOption {
  id: string;
  label: string;
  weeks: number;
}

export const PROJECT_TYPES: ProjectTypeInfo[] = [
  {
    id: "ai-automation",
    label: "AI automation",
    blurb: "Agents, LLM workflows, document handling",
    baseWeeks: 6,
    stack: ["Python", "FastAPI", "LangChain", "OpenAI", "Pinecone"],
  },
  {
    id: "web-platform",
    label: "Web platform / SaaS",
    blurb: "Dashboards, portals, full-stack products",
    baseWeeks: 8,
    stack: ["Next.js", "TypeScript", "NestJS", "PostgreSQL", "Tailwind"],
  },
  {
    id: "mobile-app",
    label: "Mobile app",
    blurb: "Customer or field-team apps",
    baseWeeks: 10,
    stack: ["React Native", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    id: "cloud-migration",
    label: "Cloud / legacy migration",
    blurb: "Move and modernise existing systems",
    baseWeeks: 7,
    stack: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
  },
  {
    id: "growth-seo",
    label: "Growth & technical SEO",
    blurb: "Search, funnels, CRM automation",
    baseWeeks: 4,
    stack: ["Next.js", "Technical SEO", "Analytics", "CRM automation"],
  },
];

export const FEATURES: FeatureInfo[] = [
  { id: "auth", label: "User accounts & roles", weeks: 1, stack: ["OAuth", "JWT"] },
  { id: "payments", label: "Payments & billing", weeks: 2, stack: ["Payment gateway", "Webhooks"] },
  { id: "realtime", label: "Real-time updates", weeks: 2, stack: ["WebSockets", "Redis"] },
  { id: "ai-agent", label: "AI assistant / agent", weeks: 3, stack: ["LLM API", "Vector DB"] },
  { id: "analytics", label: "Analytics dashboard", weeks: 2, stack: ["Charts", "Event pipeline"] },
  { id: "integrations", label: "Third-party integrations", weeks: 2, stack: ["REST", "Queue workers"] },
  { id: "admin", label: "Admin panel", weeks: 1.5, stack: ["RBAC", "Audit log"] },
  { id: "iot-ar", label: "IoT or AR component", weeks: 4, stack: ["MQTT / WebXR"] },
];

export const INDUSTRIES: { id: Industry; label: string }[] = [
  { id: "healthcare", label: "Healthcare" },
  { id: "retail", label: "Retail & e-commerce" },
  { id: "fintech", label: "Fintech" },
  { id: "education", label: "Education" },
  { id: "events", label: "Events & entertainment" },
  { id: "media", label: "Media & creative" },
  { id: "other", label: "Something else" },
];

export const BUDGETS: BudgetBand[] = [
  { id: "b1", label: "Under ₹3 lakh", min: 0, max: 300_000 },
  { id: "b2", label: "₹3 – 8 lakh", min: 300_000, max: 800_000 },
  { id: "b3", label: "₹8 – 20 lakh", min: 800_000, max: 2_000_000 },
  { id: "b4", label: "₹20 lakh +", min: 2_000_000, max: Infinity },
];

export const TIMELINES: TimelineOption[] = [
  { id: "t1", label: "Within 1 month", weeks: 4 },
  { id: "t2", label: "2 – 3 months", weeks: 12 },
  { id: "t3", label: "3 – 6 months", weeks: 24 },
  { id: "t4", label: "Flexible", weeks: 52 },
];

export interface CaseStudy {
  slug: string;
  client: string;
  title: string;
  types: ProjectType[];
  industry: Industry;
  features: FeatureId[];
}

// Titles and URLs come from https://www.cynbit.in/case-studies.
// The type / industry / feature tags are this prototype's own classification.
export const CASE_STUDIES: CaseStudy[] = [
  { slug: "wizhealth-ai-diagnostic", client: "WizHealth", title: "AI Diagnostic Triage: Enhancing Medical Efficiency", types: ["ai-automation"], industry: "healthcare", features: ["ai-agent", "analytics"] },
  { slug: "pragya-healths-remote-monitoring", client: "Pragya Healths", title: "IoT Remote Patient Monitoring for Rural Health", types: ["web-platform", "mobile-app"], industry: "healthcare", features: ["iot-ar", "realtime"] },
  { slug: "wild-basil-supply-chain", client: "Wild Basil", title: "Blockchain-Lite Transparency for Sustainable Food", types: ["web-platform"], industry: "retail", features: ["integrations", "analytics"] },
  { slug: "sofiasa-erp-modernization", client: "Sofiasa", title: "Modernizing Legacy ERP for the Digital Era", types: ["cloud-migration", "web-platform"], industry: "other", features: ["integrations", "admin"] },
  { slug: "econtentprep-adaptive-learning", client: "EContentPrep", title: "AI-Driven Adaptive Learning Pathways for EdTech", types: ["ai-automation", "web-platform"], industry: "education", features: ["ai-agent", "auth"] },
  { slug: "cloudy-tales-collaboration", client: "Cloudy Tales", title: "Real-time Collaborative Engine for Digital Storytellers", types: ["web-platform"], industry: "media", features: ["realtime", "auth"] },
  { slug: "urban-wardrobe-ar-integration", client: "Urban Wardrobe", title: "AR Virtual Try-On: Redefining the Fashion Experience", types: ["mobile-app", "web-platform"], industry: "retail", features: ["iot-ar", "payments"] },
  { slug: "evento-ticketing-scalability", client: "Evento", title: "Scaling Real-time Ticketing for Major Entertainment", types: ["web-platform", "cloud-migration"], industry: "events", features: ["realtime", "payments"] },
  { slug: "marketing-addict-ai-optimization", client: "Marketing Addict", title: "AI-Powered Campaign Optimization for Global Marketing", types: ["ai-automation", "growth-seo"], industry: "media", features: ["ai-agent", "analytics"] },
  { slug: "fashion-headless-commerce", client: "EliteVogue", title: "Next-Gen Headless Commerce for Global Fashion", types: ["web-platform"], industry: "retail", features: ["payments", "integrations"] },
  { slug: "retail-seo-growth", client: "TrendMart", title: "Hyper-local SEO strategy yields record organic growth", types: ["growth-seo"], industry: "retail", features: ["analytics"] },
  { slug: "healthcare-cloud-migration", client: "CarePlus Health", title: "Migrating critical health data to the cloud with zero downtime", types: ["cloud-migration"], industry: "healthcare", features: ["integrations", "admin"] },
  { slug: "fintech-payments-evolution", client: "GlobalPay", title: "Revolutionizing cross-border payments for the next billion users", types: ["web-platform", "mobile-app"], industry: "fintech", features: ["payments", "auth"] },
];

export const CASE_STUDY_BASE_URL = "https://www.cynbit.in/case-studies/";

export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleHighlight: string;
  titleLine2: string;
  subtitle: string;
  founderName: string;
  offerPrice: number;
  nextMonthPrice: number;
  videoUrl: string;
  videoLabel: string;
  channelName: string;
  channelAuthor: string;
}

export interface TextReview {
  id: string;
  text: string;
  name: string;
}

export interface VideoTestimonial {
  id: string;
  name: string;
  role: string;
  duration: string;
  videoId: string;
  videoUrl?: string;
  fileName?: string;
  videoQuality?: string;
  desc: string;
  tags: string[];
}

export interface PricingContent {
  title: string;
  subtitle: string;
  badge: string;
  oldPrice: number;
  currentPrice: number;
  discountPercent: number;
  currency: string;
  note: string;
  urgency: string;
  features: string[];
  installmentEnabled: boolean;
  installmentCount: number;
  installmentAmount: number;
}

export interface SocialProofContent {
  checkItems: string[];
  ctaPrice: number;
  statLabel: string;
}

export interface PackLesson {
  id: string;
  title: string;
  bunnyVideoId: string;
  orderIndex: number;
}

export interface LessonPack {
  id: string;
  packNumber: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  lessons: PackLesson[];
}

export type UserPackStatus = 'locked' | 'available' | 'paid' | 'completed';

export interface UserPackAccess {
  packId: string;
  status: UserPackStatus;
  paidAt?: string;
}

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  packAccess: UserPackAccess[];
  extraLessonIds: string[];
  isActive: boolean;
}

export interface AdminSettings {
  fullName: string;
  email: string;
}

export interface WhatsAppAction {
  title: string;
  description: string;
  message: string;
}

export interface WhatsAppContactContent {
  phoneNumber: string;
  explanation: WhatsAppAction;
  purchase: WhatsAppAction;
}

export interface FormationCard {
  id: string;
  icon: string;
  tag: string;
  title: string;
  description: string;
  modules: number;
  duration: string;
  topics: string[];
  ctaText: string;
  ctaLink: string;
}

export interface LanguageCard {
  id: string;
  name: string;
  level: string;
  flagCode: string;
}

export interface CurriculumContent {
  title: string;
  subtitle: string;
  ctaText: string;
  modulesLabel: string;
  languagesTitle: string;
  formations: FormationCard[];
  languages: LanguageCard[];
}

export interface ForWhoItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

export interface ForWhoContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  items: ForWhoItem[];
}

export interface IncludedItem {
  id: string;
  icon: string;
  titleAr: string;
  titleEn: string;
}

export interface WhatsIncludedContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  items: IncludedItem[];
}

export interface InstagramStat {
  id: string;
  value: string;
  label: string;
}

export interface InstagramContent {
  handle: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  followerHighlight: string;
  ctaText: string;
  instagramUrl: string;
  stats: InstagramStat[];
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface NavbarContent {
  whatsappUrl: string;
  whatsappMessage: string;
  ctaText: string;
  loginText: string;
  loginLink: string;
  links: NavLink[];
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterContent {
  brandName: string;
  brandDesc: string;
  instagramUrl: string;
  quickLinksTitle: string;
  quickLinks: FooterLink[];
  legalTitle: string;
  legalLinks: FooterLink[];
  contactTitle: string;
  contactEmail: string;
  contactNote: string;
  whatsappUrl: string;
  whatsappText: string;
  copyright: string;
}

export interface SiteContent {
  hero: HeroContent;
  curriculum: CurriculumContent;
  forWho: ForWhoContent;
  whatsIncluded: WhatsIncludedContent;
  instagram: InstagramContent;
  navbar: NavbarContent;
  footer: FooterContent;
  pricing: PricingContent;
  socialProof: SocialProofContent;
  textReviews: TextReview[];
  videoTestimonials: VideoTestimonial[];
  lessonPacks: LessonPack[];
  users: ManagedUser[];
  settings: AdminSettings;
  whatsappContact: WhatsAppContactContent;
}

export type LandingPageContent = Pick<
  SiteContent,
  | 'hero'
  | 'curriculum'
  | 'forWho'
  | 'whatsIncluded'
  | 'instagram'
  | 'navbar'
  | 'footer'
  | 'pricing'
  | 'socialProof'
  | 'textReviews'
  | 'videoTestimonials'
>;

export interface SiteContentResponse {
  content: SiteContent;
  landing?: LandingPageContent;
  updated_at: string | null;
  updated_by?: string | null;
  source: 'database' | 'defaults';
}

export type AdminSection =
  | 'overview'
  | 'landing'
  | 'users'
  | 'packs'
  | 'courses'
  | 'settings';

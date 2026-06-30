import { defaultSiteContent } from './defaults';
import { applyArabicLanguageNames } from './default-curriculum.data';
import type { LandingPageContent, SiteContent } from './types';

export function normalizeSiteContent(raw: Partial<SiteContent> | null | undefined): SiteContent {
  const defaults = defaultSiteContent();

  if (!raw || typeof raw !== 'object') {
    return defaults;
  }

  return {
    ...defaults,
    ...raw,
    hero: { ...defaults.hero, ...raw.hero },
    curriculum: {
      ...defaults.curriculum,
      ...raw.curriculum,
      formations: raw.curriculum?.formations?.length
        ? raw.curriculum.formations
        : defaults.curriculum.formations,
      languages: raw.curriculum?.languages?.length
        ? applyArabicLanguageNames(raw.curriculum.languages)
        : defaults.curriculum.languages,
    },
    forWho: {
      ...defaults.forWho,
      ...raw.forWho,
      items: raw.forWho?.items?.length ? raw.forWho.items : defaults.forWho.items,
    },
    whatsIncluded: {
      ...defaults.whatsIncluded,
      ...raw.whatsIncluded,
      imageUrl: raw.whatsIncluded?.imageUrl ?? defaults.whatsIncluded.imageUrl,
      items: raw.whatsIncluded?.items?.length ? raw.whatsIncluded.items : defaults.whatsIncluded.items,
    },
    instagram: {
      ...defaults.instagram,
      ...raw.instagram,
      stats: raw.instagram?.stats?.length ? raw.instagram.stats : defaults.instagram.stats,
    },
    navbar: {
      ...defaults.navbar,
      ...raw.navbar,
      loginText: raw.navbar?.loginText ?? defaults.navbar.loginText,
      loginLink: raw.navbar?.loginLink ?? defaults.navbar.loginLink,
      links: raw.navbar?.links?.length ? raw.navbar.links : defaults.navbar.links,
    },
    footer: {
      ...defaults.footer,
      ...raw.footer,
      quickLinks: raw.footer?.quickLinks?.length ? raw.footer.quickLinks : defaults.footer.quickLinks,
      legalLinks: raw.footer?.legalLinks?.length ? raw.footer.legalLinks : defaults.footer.legalLinks,
    },
    pricing: {
      ...defaults.pricing,
      ...raw.pricing,
      features: raw.pricing?.features?.length ? raw.pricing.features : defaults.pricing.features,
    },
    socialProof: { ...defaults.socialProof, ...raw.socialProof },
    textReviews: raw.textReviews?.length ? raw.textReviews : defaults.textReviews,
    videoTestimonials: raw.videoTestimonials?.length
      ? raw.videoTestimonials
      : defaults.videoTestimonials,
    lessonPacks: raw.lessonPacks?.length ? raw.lessonPacks : defaults.lessonPacks,
    users: raw.users?.length ? raw.users : defaults.users,
    settings: { ...defaults.settings, ...raw.settings },
    whatsappContact: {
      ...defaults.whatsappContact,
      ...raw.whatsappContact,
      explanation: {
        ...defaults.whatsappContact.explanation,
        ...raw.whatsappContact?.explanation,
      },
      purchase: {
        ...defaults.whatsappContact.purchase,
        ...raw.whatsappContact?.purchase,
      },
    },
  };
}

export function mergeLandingPageContent(
  current: SiteContent,
  landingPatch: Partial<LandingPageContent>,
): SiteContent {
  return normalizeSiteContent({
    ...current,
    ...landingPatch,
    hero: landingPatch.hero ? { ...current.hero, ...landingPatch.hero } : current.hero,
    curriculum: landingPatch.curriculum
      ? { ...current.curriculum, ...landingPatch.curriculum }
      : current.curriculum,
    forWho: landingPatch.forWho ? { ...current.forWho, ...landingPatch.forWho } : current.forWho,
    whatsIncluded: landingPatch.whatsIncluded
      ? { ...current.whatsIncluded, ...landingPatch.whatsIncluded }
      : current.whatsIncluded,
    instagram: landingPatch.instagram
      ? { ...current.instagram, ...landingPatch.instagram }
      : current.instagram,
    navbar: landingPatch.navbar ? { ...current.navbar, ...landingPatch.navbar } : current.navbar,
    footer: landingPatch.footer ? { ...current.footer, ...landingPatch.footer } : current.footer,
    pricing: landingPatch.pricing ? { ...current.pricing, ...landingPatch.pricing } : current.pricing,
    socialProof: landingPatch.socialProof
      ? { ...current.socialProof, ...landingPatch.socialProof }
      : current.socialProof,
    textReviews: landingPatch.textReviews ?? current.textReviews,
    videoTestimonials: landingPatch.videoTestimonials ?? current.videoTestimonials,
  });
}

export function extractLandingPageContent(content: SiteContent): LandingPageContent {
  return {
    hero: content.hero,
    curriculum: content.curriculum,
    forWho: content.forWho,
    whatsIncluded: content.whatsIncluded,
    instagram: content.instagram,
    navbar: content.navbar,
    footer: content.footer,
    pricing: content.pricing,
    socialProof: content.socialProof,
    textReviews: content.textReviews,
    videoTestimonials: content.videoTestimonials,
  };
}

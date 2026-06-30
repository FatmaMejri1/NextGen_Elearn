import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_FORMATIONS_RAW, DEFAULT_LANGUAGES_RAW, applyArabicLanguageNames } from '../data/default-curriculum.data';
import { mapHomeSectionLinks } from '../data/home-section-links';
import { buildWhatsAppUrl } from '../utils/whatsapp-url';
import {
  AdminSettings,
  CurriculumContent,
  FooterContent,
  FormationCard,
  ForWhoContent,
  ForWhoItem,
  HeroContent,
  IncludedItem,
  InstagramContent,
  InstagramStat,
  LanguageCard,
  LessonPack,
  ManagedUser,
  NavbarContent,
  PackLesson,
  PricingContent,
  SiteContent,
  SocialProofContent,
  TextReview,
  UserPackAccess,
  VideoTestimonial,
  WhatsAppContactContent,
  WhatsIncludedContent,
} from '../models/site-content.models';
import { ApiService } from './api';
import { clearLegacyLocalStorage } from '../utils/legacy-storage-cleanup';

function createId(): string {
  return crypto.randomUUID();
}

function defaultPacks(): LessonPack[] {
  const packTitles = [
    'الحزمة 1 — الأساسيات',
    'الحزمة 2 — مهارات النمو',
    'الحزمة 3 — التسويق المتقدم',
    'الحزمة 4 — أنظمة البيزنس',
    'الحزمة 5 — الإتقان والتوسع',
  ];

  return packTitles.map((title, index) => ({
    id: createId(),
    packNumber: index + 1,
    title,
    description: `الدروس تتفتح بعد الدفع ${index + 1}/5 (100 دينار لكل حزمة).`,
    price: 100,
    currency: 'دينار',
    lessons: [
      {
        id: createId(),
        title: `الدرس 1 — ${title}`,
        bunnyVideoId: '',
        orderIndex: 1,
      },
    ],
  }));
}

function defaultFormations(): FormationCard[] {
  return DEFAULT_FORMATIONS_RAW.map((item) => ({
    ...item,
    id: createId(),
    ctaText: 'شوف هالفورماسيون →',
    ctaLink: '/purchase',
  }));
}

function defaultLanguages(): LanguageCard[] {
  return DEFAULT_LANGUAGES_RAW.map((item) => ({
    ...item,
    id: createId(),
  }));
}

function defaultContent(): SiteContent {
  return {
    hero: {
      badge: '+364 ألف متابع على إنستغرام',
      titleLine1: 'وكالة الخدمات الرقمية',
      titleHighlight: '30 فورماسيون + 10 لغات',
      titleLine2: 'في باقة واحدة',
      subtitle:
        'مؤسسة من طرف نسيم أحمد — وكالة الخدمات الرقمية تعطيك وصول كامل لكل الفورماسيونات واللغات بسعر استثنائي.',
      founderName: 'نسيم أحمد',
      offerPrice: 500,
      nextMonthPrice: 1000,
      videoUrl: '',
      videoLabel: 'خارطة الطريق',
      channelName: 'وكالة الخدمات الرقمية',
      channelAuthor: 'نسيم أحمد • المؤسس',
    },
    curriculum: {
      title: 'الفورماسيونات المتاحة',
      subtitle: 'استكشف كاتالوج الفورماسيونات المهنية. اسحب باش تشوف كل البرامج.',
      ctaText: 'شوف هالفورماسيون →',
      modulesLabel: 'موديولات',
      languagesTitle: '10 لغات ومستويات مشمولة',
      formations: defaultFormations(),
      languages: defaultLanguages(),
    },
    forWho: {
      title: 'الباقة هذي ليك إذا كنت',
      subtitle: 'الباقة الكاملة هذي ليك إذا كنت...',
      imageUrl: 'Pic.png',
      ctaText: 'احصل على الباقة الكاملة توا',
      ctaLink: '#pricing',
      items: [
        {
          id: createId(),
          icon: '🚀',
          title: 'مبتدئ أو طالب تحب تبني كارير ناجحة',
          subtitle: 'Students & Beginners wanting to master high-income skills (AI, Web Dev, Languages) from scratch.',
        },
        {
          id: createId(),
          icon: '💼',
          title: 'صاحب مشروع ولا فريلانسر تلوّج على التطور',
          subtitle: 'Entrepreneurs & Freelancers looking to scale with E-commerce, Trading, and Digital Marketing strategies.',
        },
        {
          id: createId(),
          icon: '🌍',
          title: 'طموح وتحب تخدم مع شركات عالمية',
          subtitle: 'Ambitious minds wanting to learn 10 international languages and unlock global remote opportunities.',
        },
        {
          id: createId(),
          icon: '🎨',
          title: 'صنّاع المحتوى والمصممين',
          subtitle: 'Content Creators & Designers wanting to master UI/UX, Graphic Design, and Video Editing.',
        },
        {
          id: createId(),
          icon: '🛡️',
          title: 'المهتمين بالأمن السيبراني والبرمجة',
          subtitle: 'Tech enthusiasts looking to dive deep into Cyber Security, Full Stack Development, and Data Science.',
        },
      ],
    },
    whatsIncluded: {
      title: 'شنوّة مشمول مع الكورس؟',
      subtitle: 'كل اللي باش تاخذه مع الباقة في مكان واحد',
      imageUrl: 'Pic.png',
      ctaText: 'إنضمّ لأحسن كوميونيتي',
      ctaLink: 'https://wa.me/21600000000',
      items: [
        { id: createId(), icon: '📹', titleAr: 'أكثر من 30 فيديو تطبيقي', titleEn: '30+ Practical Video Lessons' },
        { id: createId(), icon: '📄', titleAr: 'ملفات Excel، Cheat Sheets، و Templates جاهزين للاستعمال', titleEn: 'Ready-to-use Excel files, Cheat Sheets & Templates' },
        { id: createId(), icon: '💬', titleAr: 'Live Coaching شهرياً مع خبراء', titleEn: 'Monthly Live Coaching with Experts' },
        { id: createId(), icon: '🌐', titleAr: 'دخول Community خاص مع باقي المشتركين', titleEn: 'Private Community Access' },
        { id: createId(), icon: '🧠', titleAr: 'Access مباشر لي أنا، لفريقي، ولشبكة شركائنا', titleEn: 'Direct Access to Me, My Team & Partner Network' },
        { id: createId(), icon: '💼', titleAr: 'فرصة نرشّحوك تخدم معانا ولا مع Brands نخدمو معاهم', titleEn: 'Job Opportunities with Our Brand Partners' },
      ],
    },
    instagram: {
      handle: '@agence_digital_services_',
      title: 'محتوانا على',
      titleHighlight: 'إنستغرام',
      subtitle: 'اكتشف شنوّا نشاركو مع كوميونيتينا اللي فيها',
      followerHighlight: '364 ألف متابع',
      ctaText: 'تابعنا على إنستغرام',
      instagramUrl: 'https://www.instagram.com/agence_digital_services_/',
      stats: [
        { id: createId(), value: '364K', label: 'متابعين' },
        { id: createId(), value: '11', label: 'منشورات' },
        { id: createId(), value: '53', label: 'متابَعين' },
      ],
    },
    navbar: {
      whatsappUrl: 'https://wa.me/21600000000',
      whatsappMessage: 'نحب%20ننضم%20للفورماسيون',
      ctaText: 'كلّمنا',
      loginText: 'دخول',
      loginLink: '/admin',
      links: mapHomeSectionLinks(createId),
    },
    footer: {
      brandName: 'وكالة الخدمات الرقمية',
      brandDesc: 'طوّر مسيرتك ومشروعك مع باقتنا الحصرية: 30 فورماسيون و10 لغات. الخبرة الرقمية في متناول يدك.',
      instagramUrl: 'https://www.instagram.com/agence_digital_services_/',
      quickLinksTitle: 'روابط سريعة',
      quickLinks: [
        { id: createId(), label: 'عنّا', href: '#about' },
        { id: createId(), label: 'البرنامج', href: '#programme' },
        { id: createId(), label: 'الأسعار', href: '#pricing' },
        { id: createId(), label: 'التسجيل', href: '/purchase' },
      ],
      legalTitle: 'قانوني',
      legalLinks: [
        { id: createId(), label: 'الشروط العامة', href: '#' },
        { id: createId(), label: 'سياسة الخصوصية', href: '#' },
        { id: createId(), label: 'البيانات القانونية', href: '#' },
      ],
      contactTitle: 'اتصل بنا',
      contactEmail: 'nassimahmed506@gmail.com',
      contactNote: 'عندك أسئلة؟ ما تترددش تكلّمنا.',
      whatsappUrl: 'https://wa.me/21600000000',
      whatsappText: 'كلّمنا على واتساب',
      copyright: '© 2026 وكالة الخدمات الرقمية. كل الحقوق محفوظة.',
    },
    pricing: {
      title: 'وصول كامل للفورماسيون',
      subtitle: 'دفعة واحدة. ما فماش اشتراك مخفي. وصول مدى الحياة.',
      badge: 'عرض الإطلاق',
      oldPrice: 1000,
      currentPrice: 500,
      discountPercent: 50,
      currency: 'دينار',
      note: 'دفعة واحدة · وصول مدى الحياة',
      urgency: 'السعر باش يزيد مع الموديولات الجاية',
      features: [
        'وصول لـ 30 فورماسيون (Full HD)',
        '10 لغات مشمولة (مستويات A1/A2/B1)',
        'موارد للتحميل (PDF، قوالب)',
        'وصول كامل لكل التحديثات المستقبلية',
      ],
      installmentEnabled: true,
      installmentCount: 5,
      installmentAmount: 100,
    },
    socialProof: {
      checkItems: [],
      ctaPrice: 347,
      statLabel: 'أكثر من 250 مشترك في أقل من شهر',
    },
    textReviews: [
      {
        id: createId(),
        text: 'كملت 100% من كورس Meta Ads ونقيمه 10/10. الفصول 4 و5 فيهم معلومات ما لقيتهاش في حتى كورس آخر.',
        name: 'نهى النصيري',
      },
      {
        id: createId(),
        text: 'كملت الكورس في نهار واحد ومعجبة برشا. المحتوى ممتاز، واضح وعملي.',
        name: 'شهاب الدين حرزالله',
      },
      {
        id: createId(),
        text: 'شفت الكورس مرتين وكل مرة نكتشف حيل جديدة.',
        name: 'زينب اللصويد',
      },
      {
        id: createId(),
        text: 'يعطيكم الصحة، المحتوى غني برشا وعملي. ننصح بيه لكل من جد.',
        name: 'عزيز الشعبي',
      },
    ],
    videoTestimonials: [
      {
        id: createId(),
        name: 'أحمد ك.',
        role: 'تجارة إلكترونية محلية',
        duration: 'قصير',
        videoId: 'e6Rx_C6ViQE',
        desc: '30 فورماسيون تغطي الأمن السيبراني، تطوير الويب، علم البيانات، الذكاء الاصطناعي، التداول وأكثر.',
        tags: ['#فورماسيون', '#رقمي'],
      },
      {
        id: createId(),
        name: 'سارة م.',
        role: 'استشارية B2B',
        duration: 'قصير',
        videoId: 'pqDQGwUi8ds',
        desc: '10 لغات مشمولة: إنجليزي، فرنسي، ألماني، إسباني، إيطالي، تركي وأكثر.',
        tags: ['#لغات', '#عالمي'],
      },
      {
        id: createId(),
        name: 'ياسين ب.',
        role: 'دروبشيبينغ',
        duration: 'قصير',
        videoId: 'WwF3K5FFCcY',
        desc: 'شهادات فيديو من طلبتنا اللي بدّلوا حياتهم المهنية.',
        tags: ['#شهادات', '#نجاح'],
      },
      {
        id: createId(),
        name: 'كليون',
        role: 'شهادة فيديو',
        duration: 'قصير',
        videoId: 'AcGExNNic_w',
        videoUrl: 'https://youtube.com/shorts/AcGExNNic_w',
        fileName: '14c199559dda44a5a25c639f9f55ed35.mov',
        videoQuality: 'HD',
        desc: 'شهادة فيديو من أحد كليوناتنا.',
        tags: ['#شهادة', '#كليون'],
      },
    ],
    lessonPacks: defaultPacks(),
    users: [
      {
        id: createId(),
        fullName: 'طالب تجريبي',
        email: 'student@example.com',
        phone: '+216 00 000 000',
        createdAt: new Date().toISOString(),
        packAccess: defaultPacks().map((pack, index) => ({
          packId: pack.id,
          status: index === 0 ? 'paid' : index === 1 ? 'available' : 'locked',
          paidAt: index === 0 ? new Date().toISOString() : undefined,
        })),
        extraLessonIds: [],
        isActive: true,
      },
    ],
    settings: {
      fullName: 'أدمن',
      email: 'admin@nextgen.local',
    },
    whatsappContact: {
      phoneNumber: '21600000000',
      explanation: {
        title: 'عندي استفسار',
        description: 'تحب تفهم أكثر على الباقة والفورماسيونات قبل ما تقرّر؟',
        message: 'سلام، عندي استفسار على الباقة ونحب نفهم أكثر.',
      },
      purchase: {
        title: 'نحب نشري الفورماسيون',
        description: 'جاهز للشراء ونحب نكمّل الطلبية على واتساب',
        message: 'سلام، نحب نشري الباقة الكاملة (30 فورماسيون + 10 لغات).',
      },
    },
  };
}

function normalizeContent(raw: Partial<SiteContent>): SiteContent {
  const defaults = defaultContent();

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
    videoTestimonials: raw.videoTestimonials?.length ? raw.videoTestimonials : defaults.videoTestimonials,
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

@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private readonly contentSubject = new BehaviorSubject<SiteContent>(defaultContent());
  private readonly loadingSubject = new BehaviorSubject<boolean>(true);
  private readonly syncErrorSubject = new BehaviorSubject<string>('');

  readonly content$ = this.contentSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly syncError$ = this.syncErrorSubject.asObservable();

  constructor(private readonly api: ApiService) {
    clearLegacyLocalStorage();
    this.refreshFromServer();
  }

  get snapshot(): SiteContent {
    return this.contentSubject.value;
  }

  refreshFromServer(): void {
    this.loadingSubject.next(true);
    this.syncErrorSubject.next('');

    this.api.getSiteContent().subscribe({
      next: (response) => {
        this.contentSubject.next(normalizeContent(response.content));
        this.loadingSubject.next(false);
      },
      error: () => {
        this.loadingSubject.next(false);
        this.syncErrorSubject.next('ما نجمناش نحمّلو المحتوى من Supabase.');
      },
    });
  }

  private saveToServer(content: SiteContent): void {
    const previous = this.snapshot;
    const normalized = normalizeContent(content);
    this.contentSubject.next(normalized);
    this.syncErrorSubject.next('');

    this.api.putAdminSiteContent(normalized).subscribe({
      next: (response) => {
        this.contentSubject.next(normalizeContent(response.content));
      },
      error: () => {
        this.contentSubject.next(previous);
        this.syncErrorSubject.next('فشل الحفظ على السيرفر.');
      },
    });
  }

  updateHero(hero: HeroContent): void {
    this.saveToServer({ ...this.snapshot, hero });
  }

  updatePricing(pricing: PricingContent): void {
    this.saveToServer({ ...this.snapshot, pricing });
  }

  updateSocialProof(socialProof: SocialProofContent): void {
    this.saveToServer({ ...this.snapshot, socialProof });
  }

  updateCurriculum(curriculum: CurriculumContent): void {
    this.saveToServer({ ...this.snapshot, curriculum });
  }

  saveFormation(formation: FormationCard): void {
    const formations = [...this.snapshot.curriculum.formations];
    const index = formations.findIndex((item) => item.id === formation.id);
    if (index >= 0) {
      formations[index] = formation;
    } else {
      formations.push(formation);
    }
    this.saveToServer({
      ...this.snapshot,
      curriculum: { ...this.snapshot.curriculum, formations },
    });
  }

  deleteFormation(id: string): void {
    this.saveToServer({
      ...this.snapshot,
      curriculum: {
        ...this.snapshot.curriculum,
        formations: this.snapshot.curriculum.formations.filter((item) => item.id !== id),
      },
    });
  }

  saveLanguage(language: LanguageCard): void {
    const languages = [...this.snapshot.curriculum.languages];
    const index = languages.findIndex((item) => item.id === language.id);
    if (index >= 0) {
      languages[index] = language;
    } else {
      languages.push(language);
    }
    this.saveToServer({
      ...this.snapshot,
      curriculum: { ...this.snapshot.curriculum, languages },
    });
  }

  deleteLanguage(id: string): void {
    this.saveToServer({
      ...this.snapshot,
      curriculum: {
        ...this.snapshot.curriculum,
        languages: this.snapshot.curriculum.languages.filter((item) => item.id !== id),
      },
    });
  }

  updateForWho(forWho: ForWhoContent): void {
    this.saveToServer({ ...this.snapshot, forWho });
  }

  saveForWhoItem(item: ForWhoItem): void {
    const items = [...this.snapshot.forWho.items];
    const index = items.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    this.saveToServer({ ...this.snapshot, forWho: { ...this.snapshot.forWho, items } });
  }

  deleteForWhoItem(id: string): void {
    this.saveToServer({
      ...this.snapshot,
      forWho: {
        ...this.snapshot.forWho,
        items: this.snapshot.forWho.items.filter((item) => item.id !== id),
      },
    });
  }

  updateWhatsIncluded(whatsIncluded: WhatsIncludedContent): void {
    this.saveToServer({ ...this.snapshot, whatsIncluded });
  }

  saveIncludedItem(item: IncludedItem): void {
    const items = [...this.snapshot.whatsIncluded.items];
    const index = items.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    this.saveToServer({
      ...this.snapshot,
      whatsIncluded: { ...this.snapshot.whatsIncluded, items },
    });
  }

  deleteIncludedItem(id: string): void {
    this.saveToServer({
      ...this.snapshot,
      whatsIncluded: {
        ...this.snapshot.whatsIncluded,
        items: this.snapshot.whatsIncluded.items.filter((item) => item.id !== id),
      },
    });
  }

  updateInstagram(instagram: InstagramContent): void {
    this.saveToServer({ ...this.snapshot, instagram });
  }

  saveInstagramStat(stat: InstagramStat): void {
    const stats = [...this.snapshot.instagram.stats];
    const index = stats.findIndex((entry) => entry.id === stat.id);
    if (index >= 0) {
      stats[index] = stat;
    } else {
      stats.push(stat);
    }
    this.saveToServer({
      ...this.snapshot,
      instagram: { ...this.snapshot.instagram, stats },
    });
  }

  deleteInstagramStat(id: string): void {
    this.saveToServer({
      ...this.snapshot,
      instagram: {
        ...this.snapshot.instagram,
        stats: this.snapshot.instagram.stats.filter((item) => item.id !== id),
      },
    });
  }

  updateNavbar(navbar: NavbarContent): void {
    this.saveToServer({ ...this.snapshot, navbar });
  }

  updateFooter(footer: FooterContent): void {
    this.saveToServer({ ...this.snapshot, footer });
  }

  updateSettings(settings: AdminSettings): void {
    this.saveToServer({ ...this.snapshot, settings });
  }

  updateWhatsAppContact(whatsappContact: WhatsAppContactContent): void {
    this.saveToServer({ ...this.snapshot, whatsappContact });
  }

  getWhatsAppUrl(kind: 'explanation' | 'purchase'): string {
    const contact = this.snapshot.whatsappContact;
    const action = kind === 'explanation' ? contact.explanation : contact.purchase;
    return buildWhatsAppUrl(contact.phoneNumber, action.message);
  }

  saveTextReview(review: TextReview): void {
    const reviews = [...this.snapshot.textReviews];
    const index = reviews.findIndex((item) => item.id === review.id);
    if (index >= 0) {
      reviews[index] = review;
    } else {
      reviews.push(review);
    }
    this.saveToServer({ ...this.snapshot, textReviews: reviews });
  }

  deleteTextReview(id: string): void {
    this.saveToServer({
      ...this.snapshot,
      textReviews: this.snapshot.textReviews.filter((item) => item.id !== id),
    });
  }

  saveVideoTestimonial(item: VideoTestimonial): void {
    const items = [...this.snapshot.videoTestimonials];
    const index = items.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    this.saveToServer({ ...this.snapshot, videoTestimonials: items });
  }

  deleteVideoTestimonial(id: string): void {
    this.saveToServer({
      ...this.snapshot,
      videoTestimonials: this.snapshot.videoTestimonials.filter((item) => item.id !== id),
    });
  }

  savePack(pack: LessonPack): void {
    const packs = [...this.snapshot.lessonPacks];
    const index = packs.findIndex((item) => item.id === pack.id);
    if (index >= 0) {
      packs[index] = pack;
    } else {
      packs.push(pack);
    }
    packs.sort((a, b) => a.packNumber - b.packNumber);
    this.saveToServer({ ...this.snapshot, lessonPacks: packs });
  }

  deletePack(id: string): void {
    this.saveToServer({
      ...this.snapshot,
      lessonPacks: this.snapshot.lessonPacks.filter((item) => item.id !== id),
    });
  }

  savePackLesson(packId: string, lesson: PackLesson): void {
    const packs = this.snapshot.lessonPacks.map((pack) => {
      if (pack.id !== packId) {
        return pack;
      }

      const lessons = [...pack.lessons];
      const index = lessons.findIndex((item) => item.id === lesson.id);
      if (index >= 0) {
        lessons[index] = lesson;
      } else {
        lessons.push(lesson);
      }

      return {
        ...pack,
        lessons: lessons.sort((a, b) => a.orderIndex - b.orderIndex),
      };
    });

    this.saveToServer({ ...this.snapshot, lessonPacks: packs });
  }

  deletePackLesson(packId: string, lessonId: string): void {
    const packs = this.snapshot.lessonPacks.map((pack) =>
      pack.id === packId
        ? { ...pack, lessons: pack.lessons.filter((lesson) => lesson.id !== lessonId) }
        : pack,
    );
    this.saveToServer({ ...this.snapshot, lessonPacks: packs });
  }

  saveUser(user: ManagedUser): void {
    const users = [...this.snapshot.users];
    const index = users.findIndex((item) => item.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.unshift(user);
    }
    this.saveToServer({ ...this.snapshot, users });
  }

  deleteUser(id: string): void {
    this.saveToServer({
      ...this.snapshot,
      users: this.snapshot.users.filter((item) => item.id !== id),
    });
  }

  createUserDraft(): ManagedUser {
    const packAccess: UserPackAccess[] = this.snapshot.lessonPacks.map((pack, index) => ({
      packId: pack.id,
      status: index === 0 ? 'available' : 'locked',
    }));

    return {
      id: createId(),
      fullName: '',
      email: '',
      phone: '',
      createdAt: new Date().toISOString(),
      packAccess,
      extraLessonIds: [],
      isActive: true,
    };
  }

  createTextReviewDraft(): TextReview {
    return { id: createId(), text: '', name: '' };
  }

  createVideoTestimonialDraft(): VideoTestimonial {
    return {
      id: createId(),
      name: '',
      role: '',
      duration: 'قصير',
      videoId: '',
      videoUrl: '',
      fileName: '',
      videoQuality: '',
      desc: '',
      tags: [],
    };
  }

  createFormationDraft(): FormationCard {
    return {
      id: createId(),
      icon: '📚',
      tag: 'فورماسيون',
      title: '',
      description: '',
      modules: 1,
      duration: '1h',
      topics: [],
      ctaText: this.snapshot.curriculum.ctaText,
      ctaLink: '/purchase',
    };
  }

  createLanguageDraft(): LanguageCard {
    return { id: createId(), name: '', level: 'A1 / A2 / B1', flagCode: 'tn' };
  }

  createForWhoItemDraft(): ForWhoItem {
    return { id: createId(), icon: '✨', title: '', subtitle: '' };
  }

  createIncludedItemDraft(): IncludedItem {
    return { id: createId(), icon: '📌', titleAr: '', titleEn: '' };
  }

  createInstagramStatDraft(): InstagramStat {
    return { id: createId(), value: '', label: '' };
  }

  createNavLinkDraft(): { id: string; label: string; href: string } {
    return { id: createId(), label: '', href: '#' };
  }

  createFooterLinkDraft(): { id: string; label: string; href: string } {
    return { id: createId(), label: '', href: '#' };
  }

  createPackLessonDraft(): PackLesson {
    return { id: createId(), title: '', bunnyVideoId: '', orderIndex: 1 };
  }

  resetToDefaults(): void {
    this.syncErrorSubject.next('');
    this.api.resetAdminSiteContent().subscribe({
      next: (response) => {
        this.contentSubject.next(normalizeContent(response.content));
      },
      error: () => {
        this.syncErrorSubject.next('فشل إرجاع الإعدادات الافتراضية.');
      },
    });
  }
}

import { randomUUID } from 'crypto';
import { DEFAULT_FORMATIONS_RAW, DEFAULT_LANGUAGES_RAW } from './default-curriculum.data';
import type { FormationCard, LanguageCard, LessonPack, SiteContent } from './types';

function createId(): string {
  return randomUUID();
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

export function defaultSiteContent(): SiteContent {
  const packs = defaultPacks();

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
          subtitle:
            'Students & Beginners wanting to master high-income skills (AI, Web Dev, Languages) from scratch.',
        },
        {
          id: createId(),
          icon: '💼',
          title: 'صاحب مشروع ولا فريلانسر تلوّج على التطور',
          subtitle:
            'Entrepreneurs & Freelancers looking to scale with E-commerce, Trading, and Digital Marketing strategies.',
        },
        {
          id: createId(),
          icon: '🌍',
          title: 'طموح وتحب تخدم مع شركات عالمية',
          subtitle:
            'Ambitious minds wanting to learn 10 international languages and unlock global remote opportunities.',
        },
        {
          id: createId(),
          icon: '🎨',
          title: 'صنّاع المحتوى والمصممين',
          subtitle:
            'Content Creators & Designers wanting to master UI/UX, Graphic Design, and Video Editing.',
        },
        {
          id: createId(),
          icon: '🛡️',
          title: 'المهتمين بالأمن السيبراني والبرمجة',
          subtitle:
            'Tech enthusiasts looking to dive deep into Cyber Security, Full Stack Development, and Data Science.',
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
        {
          id: createId(),
          icon: '📄',
          titleAr: 'ملفات Excel، Cheat Sheets، و Templates جاهزين للاستعمال',
          titleEn: 'Ready-to-use Excel files, Cheat Sheets & Templates',
        },
        { id: createId(), icon: '💬', titleAr: 'Live Coaching شهرياً مع خبراء', titleEn: 'Monthly Live Coaching with Experts' },
        { id: createId(), icon: '🌐', titleAr: 'دخول Community خاص مع باقي المشتركين', titleEn: 'Private Community Access' },
        {
          id: createId(),
          icon: '🧠',
          titleAr: 'Access مباشر لي أنا، لفريقي، ولشبكة شركائنا',
          titleEn: 'Direct Access to Me, My Team & Partner Network',
        },
        {
          id: createId(),
          icon: '💼',
          titleAr: 'فرصة نرشّحوك تخدم معانا ولا مع Brands نخدمو معاهم',
          titleEn: 'Job Opportunities with Our Brand Partners',
        },
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
      links: [
        { id: createId(), label: 'عنّا', href: '#about' },
        { id: createId(), label: 'الكليونات', href: '#social-proof' },
        { id: createId(), label: 'الفورماسيونات', href: '#programme' },
        { id: createId(), label: 'اللغات', href: '#languages' },
        { id: createId(), label: 'شنوّا مشمول', href: '#included' },
        { id: createId(), label: 'شنوّا يقولو علينا', href: '#testimonials' },
        { id: createId(), label: 'إنستغرام', href: '#instagram' },
        { id: createId(), label: 'الأسعار', href: '#pricing' },
      ],
    },
    footer: {
      brandName: 'وكالة الخدمات الرقمية',
      brandDesc:
        'طوّر مسيرتك ومشروعك مع باقتنا الحصرية: 30 فورماسيون و10 لغات. الخبرة الرقمية في متناول يدك.',
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
    lessonPacks: packs,
    users: [
      {
        id: createId(),
        fullName: 'طالب تجريبي',
        email: 'student@example.com',
        phone: '+216 00 000 000',
        createdAt: new Date().toISOString(),
        packAccess: packs.map((pack, index) => ({
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

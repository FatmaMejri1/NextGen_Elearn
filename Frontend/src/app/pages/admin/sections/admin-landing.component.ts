import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CurriculumContent,
  FooterContent,
  FormationCard,
  HeroContent,
  IncludedItem,
  InstagramContent,
  InstagramStat,
  LanguageCard,
  NavbarContent,
  PricingContent,
  SocialProofContent,
  TextReview,
  VideoTestimonial,
  WhatsIncludedContent,
} from '../../../models/site-content.models';
import { SiteContentService } from '../../../services/site-content.service';
import { ModalService } from '../../../services/modal.service';
import { extractYouTubeVideoId } from '../../../utils/youtube-url';

type LandingTab =
  | 'hero'
  | 'navbar'
  | 'included'
  | 'formations'
  | 'languages'
  | 'reviews'
  | 'videos'
  | 'social'
  | 'instagram'
  | 'pricing'
  | 'footer';

@Component({
  selector: 'app-admin-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-landing.component.html',
  styleUrl: './admin-landing.component.scss',
})
export class AdminLandingComponent implements OnInit {
  @Output() notify = new EventEmitter<{ type: 'success' | 'error'; text: string }>();

  activeTab: LandingTab = 'hero';
  hero!: HeroContent;
  navbar!: NavbarContent;
  whatsIncluded!: WhatsIncludedContent;
  curriculum!: CurriculumContent;
  instagram!: InstagramContent;
  socialProof!: SocialProofContent;
  pricing!: PricingContent;
  footer!: FooterContent;
  textReviews: TextReview[] = [];
  videoTestimonials: VideoTestimonial[] = [];

  editingReview: TextReview | null = null;
  editingVideo: VideoTestimonial | null = null;
  editingFormation: FormationCard | null = null;
  editingIncludedItem: IncludedItem | null = null;
  editingLanguage: LanguageCard | null = null;
  editingInstagramStat: InstagramStat | null = null;

  tagInput = '';
  topicInput = '';

  readonly tabs: { id: LandingTab; label: string }[] = [
    { id: 'hero', label: 'الهيرو والفيديو' },
    { id: 'navbar', label: 'القائمة العلوية' },
    { id: 'included', label: 'شنوّا مشمول' },
    { id: 'formations', label: 'الفورماسيونات' },
    { id: 'languages', label: 'اللغات' },
    { id: 'reviews', label: 'تعليقات الكليونات' },
    { id: 'videos', label: 'فيديوهات الكليونات' },
    { id: 'social', label: 'الإثبات الاجتماعي' },
    { id: 'instagram', label: 'إنستغرام' },
    { id: 'pricing', label: 'الأسعار' },
    { id: 'footer', label: 'الفوتر' },
  ];

  constructor(
    private readonly siteContent: SiteContentService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.hero = structuredClone(content.hero);
      this.navbar = structuredClone(content.navbar);
      this.whatsIncluded = structuredClone(content.whatsIncluded);
      this.curriculum = structuredClone(content.curriculum);
      this.instagram = structuredClone(content.instagram);
      this.socialProof = structuredClone(content.socialProof);
      this.pricing = structuredClone(content.pricing);
      this.footer = structuredClone(content.footer);
      this.textReviews = structuredClone(content.textReviews);
      this.videoTestimonials = structuredClone(content.videoTestimonials);
    });
  }

  async saveHero(): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد التحديث', 'تحب تحفظ تغييرات الهيرو؟');
    if (!confirm) return;
    this.siteContent.updateHero(this.hero);
    this.notify.emit({ type: 'success', text: 'قسم الهيرو تحدّث.' });
  }

  async saveNavbar(): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد التحديث', 'تحب تحفظ تغييرات القائمة العلوية؟');
    if (!confirm) return;
    this.siteContent.updateNavbar(this.navbar);
    this.notify.emit({ type: 'success', text: 'القائمة العلوية تحدّثت.' });
  }

  addNavLink(): void {
    this.navbar.links = [...this.navbar.links, this.siteContent.createNavLinkDraft()];
  }

  removeNavLink(index: number): void {
    this.navbar.links = this.navbar.links.filter((_, i) => i !== index);
  }

  async savePricing(): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد التحديث', 'تحب تحفظ تغييرات قسم الأسعار؟');
    if (!confirm) return;
    this.siteContent.updatePricing(this.pricing);
    this.notify.emit({ type: 'success', text: 'قسم الأسعار تحدّث.' });
  }

  addPricingFeature(): void {
    this.pricing.features = [...this.pricing.features, 'ميزة جديدة'];
  }

  removePricingFeature(index: number): void {
    this.pricing.features = this.pricing.features.filter((_, i) => i !== index);
  }

  async saveFooter(): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد التحديث', 'تحب تحفظ تغييرات الفوتر؟');
    if (!confirm) return;
    this.siteContent.updateFooter(this.footer);
    this.notify.emit({ type: 'success', text: 'الفوتر تحدّث.' });
  }

  async saveWhatsIncluded(): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد التحديث', 'تحب تحفظ تغييرات قسم شنوّا مشمول؟');
    if (!confirm) return;
    this.siteContent.updateWhatsIncluded(this.whatsIncluded);
    this.notify.emit({ type: 'success', text: 'قسم شنوّا مشمول تحدّث.' });
  }

  startIncludedItem(item?: IncludedItem): void {
    this.editingIncludedItem = item
      ? structuredClone(item)
      : this.siteContent.createIncludedItemDraft();
  }

  async saveIncludedItem(): Promise<void> {
    if (!this.editingIncludedItem?.titleAr.trim()) {
      this.notify.emit({ type: 'error', text: 'العنوان بالعربي لازم.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد الحفظ', 'تحب تحفظ هالعنصر؟');
    if (!confirm) return;
    this.siteContent.saveIncludedItem(this.editingIncludedItem);
    this.editingIncludedItem = null;
    this.notify.emit({ type: 'success', text: 'العنصر تحفظ.' });
  }

  async deleteIncludedItem(id: string): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد الحذف', 'تحب تحذف هالعنصر؟');
    if (!confirm) return;
    this.siteContent.deleteIncludedItem(id);
    this.notify.emit({ type: 'success', text: 'العنصر انحذف.' });
  }

  async saveFormationsHeader(): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد التحديث', 'تحب تحفظ تغييرات قسم الفورماسيونات؟');
    if (!confirm) return;
    this.siteContent.updateCurriculum(this.curriculum);
    this.notify.emit({ type: 'success', text: 'قسم الفورماسيونات تحدّث.' });
  }

  async saveLanguagesHeader(): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد التحديث', 'تحب تحفظ تغييرات قسم اللغات؟');
    if (!confirm) return;
    this.siteContent.updateCurriculum(this.curriculum);
    this.notify.emit({ type: 'success', text: 'قسم اللغات تحدّث.' });
  }

  startFormation(item?: FormationCard): void {
    this.editingFormation = item
      ? structuredClone(item)
      : this.siteContent.createFormationDraft();
    this.topicInput = this.editingFormation.topics.join(', ');
  }

  async saveFormation(): Promise<void> {
    if (!this.editingFormation?.title.trim() || !this.editingFormation.tag.trim()) {
      this.notify.emit({ type: 'error', text: 'العنوان والتصنيف لازمتهم.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد الحفظ', 'تحب تحفظ هالفورماسيون؟');
    if (!confirm) return;
    this.editingFormation.topics = this.topicInput
      .split(',')
      .map((topic) => topic.trim())
      .filter(Boolean);
    this.siteContent.saveFormation(this.editingFormation);
    this.editingFormation = null;
    this.topicInput = '';
    this.notify.emit({ type: 'success', text: 'الفورماسيون تحفظ.' });
  }

  async deleteFormation(id: string): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد الحذف', 'تحب تحذف هالفورماسيون؟');
    if (!confirm) return;
    this.siteContent.deleteFormation(id);
    this.notify.emit({ type: 'success', text: 'الفورماسيون انحذف.' });
  }

  startLanguage(item?: LanguageCard): void {
    this.editingLanguage = item
      ? structuredClone(item)
      : this.siteContent.createLanguageDraft();
  }

  async saveLanguage(): Promise<void> {
    if (!this.editingLanguage?.name.trim()) {
      this.notify.emit({ type: 'error', text: 'اسم اللغة لازم.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد الحفظ', 'تحب تحفظ هاللغة؟');
    if (!confirm) return;
    this.siteContent.saveLanguage(this.editingLanguage);
    this.editingLanguage = null;
    this.notify.emit({ type: 'success', text: 'اللغة تحفظت.' });
  }

  async deleteLanguage(id: string): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد الحذف', 'تحب تحذف هاللغة؟');
    if (!confirm) return;
    this.siteContent.deleteLanguage(id);
    this.notify.emit({ type: 'success', text: 'اللغة انحذفت.' });
  }

  async saveInstagram(): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد التحديث', 'تحب تحفظ تغييرات إنستغرام؟');
    if (!confirm) return;
    this.siteContent.updateInstagram(this.instagram);
    this.notify.emit({ type: 'success', text: 'قسم إنستغرام تحدّث.' });
  }

  startInstagramStat(item?: InstagramStat): void {
    this.editingInstagramStat = item
      ? structuredClone(item)
      : this.siteContent.createInstagramStatDraft();
  }

  async saveInstagramStat(): Promise<void> {
    if (!this.editingInstagramStat?.value.trim() || !this.editingInstagramStat.label.trim()) {
      this.notify.emit({ type: 'error', text: 'القيمة والتسمية لازمتهم.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد الحفظ', 'تحب تحفظ هالإحصائية؟');
    if (!confirm) return;
    this.siteContent.saveInstagramStat(this.editingInstagramStat);
    this.editingInstagramStat = null;
    this.notify.emit({ type: 'success', text: 'الإحصائية تحفظت.' });
  }

  async deleteInstagramStat(id: string): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد الحذف', 'تحب تحذف هالإحصائية؟');
    if (!confirm) return;
    this.siteContent.deleteInstagramStat(id);
    this.notify.emit({ type: 'success', text: 'الإحصائية انحذفت.' });
  }

  async saveSocialProof(): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد التحديث', 'تحب تحفظ تغييرات الإثبات الاجتماعي؟');
    if (!confirm) return;
    this.siteContent.updateSocialProof(this.socialProof);
    this.notify.emit({ type: 'success', text: 'الإثبات الاجتماعي تحدّث.' });
  }

  startReview(review?: TextReview): void {
    this.editingReview = review ? structuredClone(review) : this.siteContent.createTextReviewDraft();
  }

  async saveReview(): Promise<void> {
    if (!this.editingReview?.name.trim() || !this.editingReview.text.trim()) {
      this.notify.emit({ type: 'error', text: 'الاسم والتعليق لازمتهم.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد الحفظ', 'تحب تحفظ هالتعليق؟');
    if (!confirm) return;
    this.siteContent.saveTextReview(this.editingReview);
    this.editingReview = null;
    this.notify.emit({ type: 'success', text: 'التعليق تحفظ.' });
  }

  async deleteReview(id: string): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد الحذف', 'تحب تحذف هالتعليق؟');
    if (!confirm) return;
    this.siteContent.deleteTextReview(id);
    this.notify.emit({ type: 'success', text: 'التعليق انحذف.' });
  }

  startVideo(item?: VideoTestimonial): void {
    this.editingVideo = item
      ? structuredClone(item)
      : this.siteContent.createVideoTestimonialDraft();
    this.tagInput = this.editingVideo.tags.join(', ');
  }

  async saveVideo(): Promise<void> {
    if (!this.editingVideo?.name.trim()) {
      this.notify.emit({ type: 'error', text: 'الاسم لازم.' });
      return;
    }

    const fromUrl = this.editingVideo.videoUrl
      ? extractYouTubeVideoId(this.editingVideo.videoUrl)
      : '';
    const fromId = extractYouTubeVideoId(this.editingVideo.videoId);
    this.editingVideo.videoId = fromUrl || fromId;

    if (!this.editingVideo.videoId.trim()) {
      this.notify.emit({ type: 'error', text: 'رابط يوتيوب أو المعرّف لازم.' });
      return;
    }

    const confirm = await this.modalService.confirm('تأكيد الحفظ', 'تحب تحفظ هالفيديو؟');
    if (!confirm) return;

    this.editingVideo.tags = this.tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    this.siteContent.saveVideoTestimonial(this.editingVideo);
    this.editingVideo = null;
    this.tagInput = '';
    this.notify.emit({ type: 'success', text: 'الفيديو تحفظ.' });
  }

  async deleteVideo(id: string): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد الحذف', 'تحب تحذف هالفيديو؟');
    if (!confirm) return;
    this.siteContent.deleteVideoTestimonial(id);
    this.notify.emit({ type: 'success', text: 'الفيديو انحذف.' });
  }
}

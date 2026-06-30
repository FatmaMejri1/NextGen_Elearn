import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AdminSettings, WhatsAppContactContent } from '../../../models/site-content.models';
import { ApiService } from '../../../services/api';
import { SiteContentService } from '../../../services/site-content.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
})
export class AdminSettingsComponent implements OnInit {
  @Output() notify = new EventEmitter<{ type: 'success' | 'error'; text: string }>();

  settings!: AdminSettings;
  whatsappContact!: WhatsAppContactContent;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private readonly api: ApiService,
    private readonly siteContent: SiteContentService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.settings = structuredClone(content.settings);
      this.whatsappContact = structuredClone(content.whatsappContact);
    });
  }

  async saveProfile(): Promise<void> {
    if (!this.settings.fullName.trim() || !this.settings.email.trim()) {
      this.notify.emit({ type: 'error', text: 'الاسم والإيميل لازمتهم.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد الحفظ', 'تحب تحفظ تغييرات البروفيل؟');
    if (!confirm) return;

    this.siteContent.updateSettings(this.settings);
    this.notify.emit({ type: 'success', text: 'البروفيل تحدّث وتحفظ.' });
  }

  async saveWhatsApp(): Promise<void> {
    if (!this.whatsappContact.phoneNumber.trim()) {
      this.notify.emit({ type: 'error', text: 'رقم واتساب لازم.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد الحفظ', 'تحب تحفظ إعدادات واتساب؟');
    if (!confirm) return;

    this.siteContent.updateWhatsAppContact(this.whatsappContact);
    this.notify.emit({ type: 'success', text: 'إعدادات واتساب تحفظت.' });
  }

  async changePassword(): Promise<void> {
    if (!this.currentPassword || !this.newPassword) {
      this.notify.emit({ type: 'error', text: 'اكتب كلمة السر الحالية والجديدة.' });
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.notify.emit({ type: 'error', text: 'كلمات السر الجديدة موش كيف كيف.' });
      return;
    }
    if (this.newPassword.length < 8) {
      this.notify.emit({ type: 'error', text: 'كلمة السر لازم 8 حروف على الأقل.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد التغيير', 'تحب تغيّر كلمة السر؟');
    if (!confirm) return;

    try {
      await firstValueFrom(
        this.api.changeAdminPassword({
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
        }),
      );
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    this.notify.emit({ type: 'success', text: 'كلمة السر تغيّرت بنجاح.' });
    } catch (error: any) {
      this.notify.emit({
        type: 'error',
        text: error.error?.error || 'Ù…Ø§ Ù†Ø¬Ù…Ù†Ø§Ø´ Ù†ØºÙŠØ±Ùˆ ÙƒÙ„Ù…Ø© Ø§Ù„Ø³Ø±.',
      });
    }
  }

  async resetContent(): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد الاسترجاع', 'تحب ترجّع كل محتوى المعاينة للإعدادات الافتراضية؟');
    if (!confirm) return;

    this.siteContent.resetToDefaults();
    this.notify.emit({ type: 'success', text: 'المحتوى رجع للإعدادات الافتراضية.' });
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LessonPack, PackLesson } from '../../../models/site-content.models';
import { SiteContentService } from '../../../services/site-content.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-admin-packs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-packs.component.html',
  styleUrl: './admin-packs.component.scss',
})
export class AdminPacksComponent implements OnInit {
  @Output() notify = new EventEmitter<{ type: 'success' | 'error'; text: string }>();

  packs: LessonPack[] = [];
  selectedPackId = '';
  editingPack: LessonPack | null = null;
  editingLesson: { packId: string; lesson: PackLesson } | null = null;

  constructor(
    private readonly siteContent: SiteContentService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.packs = structuredClone(content.lessonPacks);
      if (!this.selectedPackId && this.packs.length) {
        this.selectedPackId = this.packs[0].id;
      }
    });
  }

  get selectedPack(): LessonPack | undefined {
    return this.packs.find((pack) => pack.id === this.selectedPackId);
  }

  startPack(pack?: LessonPack): void {
    this.editingPack = pack
      ? structuredClone(pack)
      : {
          id: crypto.randomUUID(),
          packNumber: this.packs.length + 1,
          title: `حزمة ${this.packs.length + 1}`,
          description: '',
          price: 100,
          currency: 'DT',
          lessons: [],
        };
  }

  async savePack(): Promise<void> {
    if (!this.editingPack?.title.trim()) {
      this.notify.emit({ type: 'error', text: 'عنوان الحزمة لازم.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد الحفظ', `تحب تحفظ تغييرات الحزمة "${this.editingPack.title}"؟`);
    if (!confirm) return;

    this.siteContent.savePack(this.editingPack);
    this.selectedPackId = this.editingPack.id;
    this.editingPack = null;
    this.notify.emit({ type: 'success', text: 'الحزمة تحفظت.' });
  }

  async deletePack(id: string): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد الحذف', 'تحب تحذف هالحزمة والدروس متاعها؟');
    if (!confirm) return;

    this.siteContent.deletePack(id);
    this.selectedPackId = this.packs[0]?.id || '';
    this.notify.emit({ type: 'success', text: 'الحزمة انحذفت.' });
  }

  startLesson(packId: string, lesson?: PackLesson): void {
    const pack = this.packs.find((item) => item.id === packId);
    this.editingLesson = {
      packId,
      lesson: lesson
        ? structuredClone(lesson)
        : {
            ...this.siteContent.createPackLessonDraft(),
            orderIndex: (pack?.lessons.length || 0) + 1,
          },
    };
  }

  async saveLesson(): Promise<void> {
    if (!this.editingLesson?.lesson.title.trim()) {
      this.notify.emit({ type: 'error', text: 'عنوان الدرس لازم.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد الحفظ', `تحب تحفظ الدرس "${this.editingLesson.lesson.title}"؟`);
    if (!confirm) return;

    this.siteContent.savePackLesson(this.editingLesson.packId, this.editingLesson.lesson);
    this.editingLesson = null;
    this.notify.emit({ type: 'success', text: 'الدرس تحفظ.' });
  }

  async deleteLesson(packId: string, lessonId: string): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد الحذف', 'تحب تحذف هالدرس؟');
    if (!confirm) return;

    this.siteContent.deletePackLesson(packId, lessonId);
    this.notify.emit({ type: 'success', text: 'الدرس انحذف.' });
  }
}

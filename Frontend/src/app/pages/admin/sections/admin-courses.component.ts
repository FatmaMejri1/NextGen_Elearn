import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Course, LessonPayload } from '../../../services/api';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-courses.component.html',
  styleUrl: './admin-courses.component.scss',
})
export class AdminCoursesComponent implements OnChanges {
  @Input() courses: Course[] = [];
  @Input() loading = false;
  @Output() notify = new EventEmitter<{ type: 'success' | 'error'; text: string }>();
  @Output() refresh = new EventEmitter<void>();

  savingCourse = false;
  savingLesson = false;
  selectedCourseId = '';

  newCourse = { title: '', description: '', is_published: false };
  newLesson: LessonPayload = { course_id: '', title: '', bunny_video_id: '', order_index: 0 };

  constructor(
    private readonly api: ApiService,
    private readonly modalService: ModalService,
  ) {}

  get selectedCourse(): Course | undefined {
    return this.courses.find((course) => course.id === this.selectedCourseId);
  }

  ngOnChanges(): void {
    this.selectedCourseId = this.selectedCourseId || this.courses[0]?.id || '';
    this.newLesson.course_id = this.selectedCourseId;
  }

  selectCourse(courseId: string): void {
    this.selectedCourseId = courseId;
    this.newLesson.course_id = courseId;
  }

  async createCourse(): Promise<void> {
    if (!this.newCourse.title.trim()) {
      this.notify.emit({ type: 'error', text: 'عنوان الدورة لازم.' });
      return;
    }
    const confirm = await this.modalService.confirm(
      'تأكيد الإضافة',
      `تحب تزيد دورة جديدة باسم "${this.newCourse.title}"؟`
    );
    if (!confirm) return;

    this.savingCourse = true;
    this.api.createCourse(this.newCourse).subscribe({
      next: () => {
        this.newCourse = { title: '', description: '', is_published: false };
        this.savingCourse = false;
        this.notify.emit({ type: 'success', text: 'الدورة تخلقت.' });
        this.refresh.emit();
      },
      error: (error) => {
        this.savingCourse = false;
        this.notify.emit({ type: 'error', text: error.error?.error || 'ما نجمناش نخلقوا الدورة.' });
      },
    });
  }

  async togglePublished(course: Course): Promise<void> {
    const actionText = course.is_published ? 'توقيف نشر' : 'نشر';
    const confirm = await this.modalService.confirm(
      'تأكيد الحالة',
      `تحب تعمل ${actionText} للدورة "${course.title}"؟`
    );
    if (!confirm) return;

    this.api.updateCourse(course.id, { is_published: !course.is_published }).subscribe({
      next: ({ course: updated }) => {
        course.is_published = updated.is_published;
        this.notify.emit({
          type: 'success',
          text: updated.is_published ? 'الدورة تنشرت.' : 'الدورة توقفت عن النشر.',
        });
      },
      error: (error) => {
        this.notify.emit({ type: 'error', text: error.error?.error || 'ما نجمناش نحدّثوا الدورة.' });
      },
    });
  }

  async deleteCourse(course: Course): Promise<void> {
    const confirm = await this.modalService.confirm(
      'تأكيد الحذف',
      `تحب تحذف "${course.title}"؟ كل الدروس متاعها باش يتمسحوا.`
    );
    if (!confirm) return;

    this.api.deleteCourse(course.id).subscribe({
      next: () => {
        this.notify.emit({ type: 'success', text: 'الدورة انحذفت.' });
        this.refresh.emit();
      },
      error: (error) => {
        this.notify.emit({ type: 'error', text: error.error?.error || 'ما نجمناش نحذفوا الدورة.' });
      },
    });
  }

  async createLesson(): Promise<void> {
    if (!this.newLesson.course_id || !this.newLesson.title.trim()) {
      this.notify.emit({ type: 'error', text: 'اختار دورة واكتب عنوان الدرس.' });
      return;
    }
    const confirm = await this.modalService.confirm(
      'تأكيد إضافة الدرس',
      `تحب تزيد درس جديد باسم "${this.newLesson.title}"؟`
    );
    if (!confirm) return;

    this.savingLesson = true;
    this.api.createLesson(this.newLesson).subscribe({
      next: () => {
        this.newLesson = {
          course_id: this.selectedCourseId,
          title: '',
          bunny_video_id: '',
          order_index: 0,
        };
        this.savingLesson = false;
        this.notify.emit({ type: 'success', text: 'الدرس تزاد.' });
        this.refresh.emit();
      },
      error: (error) => {
        this.savingLesson = false;
        this.notify.emit({ type: 'error', text: error.error?.error || 'ما نجمناش نزيدوا الدرس.' });
      },
    });
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const confirm = await this.modalService.confirm('تأكيد الحذف', 'تحب تحذف هالدرس؟');
    if (!confirm) return;

    this.api.deleteLesson(lessonId).subscribe({
      next: () => {
        this.notify.emit({ type: 'success', text: 'الدرس انحذف.' });
        this.refresh.emit();
      },
      error: (error) => {
        this.notify.emit({ type: 'error', text: error.error?.error || 'ما نجمناش نحذفوا الدرس.' });
      },
    });
  }
}

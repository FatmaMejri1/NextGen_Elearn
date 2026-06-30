import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SiteContent } from '../../../models/site-content.models';
import { SiteContentService } from '../../../services/site-content.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-head">
      <div>
        <p>ملخص سريع للمحتوى والمستخدمين متاع المنصة.</p>
      </div>

    </div>

    <div class="stats-grid">
      <article class="stat-card">
        <span class="stat-label">تعليقات الكليونات</span>
        <strong>{{ content.textReviews.length }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">فيديوهات الكليونات</span>
        <strong>{{ content.videoTestimonials.length }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">حزم الدروس</span>
        <strong>{{ content.lessonPacks.length }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">المستخدمين</span>
        <strong>{{ content.users.length }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">الفورماسيونات</span>
        <strong>{{ content.curriculum.formations.length }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">اللغات</span>
        <strong>{{ content.curriculum.languages.length }}</strong>
      </article>
    </div>

    <div class="panel">
      <h3>أقسام لوحة التحكم</h3>
      <ul class="checklist">
        <li><strong>المحتوى:</strong> تعديل أقسام الموقع (العناوين، النصوص، الصور، الروابط) وترتيبها حسب الحاجة</li>
        <li><strong>المستخدمين:</strong> إنشاء المستخدمين، تفعيل الحسابات، وتحديد الصلاحيات/الوصول للمحتوى</li>
        <li><strong>الكورسات/الدروس:</strong> إنشاء كورسات، إضافة وحدات ودروس، وربط الفيديوهات أو الملفات التعليمية</li>
        <li><strong>شهادات الكليونات:</strong> إضافة/تعديل تعليقات وفيديوهات المراجعات وإظهارها في الصفحة الرئيسية</li>
        <li><strong>الإعدادات:</strong> إعدادات الحساب، روابط التواصل، وإعدادات المنصة العامة</li>
      </ul>
    </div>
  `,
  styles: `
    .section-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 24px; }
    .section-head p, .hint { color: var(--text-muted); font-size: 14px; }
    .badge { background: rgba(46,117,182,.15); color: var(--secondary); border: 1px solid var(--border); border-radius: 999px; padding: 6px 12px; font-size: 12px; font-weight: 700; white-space: nowrap; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 20px; }
    .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: grid; gap: 8px; }
    .stat-label { color: var(--text-muted); font-size: 13px; }
    .stat-card strong { font-size: 28px; color: #fff; }
    .panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
    .panel h3 { margin-bottom: 12px; font-size: 18px; }
    .checklist { display: grid; gap: 10px; color: var(--text-main); font-size: 14px; list-style: none; }
    .checklist li::before { content: '✓'; color: var(--cta-green); margin-right: 8px; font-weight: 800; }
    .checklist strong { color: #fff; }
    .hint { margin-top: 12px; }
    .static-note { font-size: 13px; opacity: 0.9; }
    @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 560px) { .stats-grid { grid-template-columns: 1fr; } .section-head { flex-direction: column; } }
  `,
})
export class AdminOverviewComponent implements OnInit {
  content!: SiteContent;

  constructor(private readonly siteContent: SiteContentService) {
    this.content = this.siteContent.snapshot;
  }

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.content = content;
    });
  }
}

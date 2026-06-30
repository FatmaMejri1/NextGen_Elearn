import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminSection } from '../../models/site-content.models';
import { ApiService, Course } from '../../services/api';
import { SiteContentService } from '../../services/site-content.service';
import { ModalService } from '../../services/modal.service';
import { AdminCoursesComponent } from './sections/admin-courses.component';
import { AdminLandingComponent } from './sections/admin-landing.component';
import { AdminOverviewComponent } from './sections/admin-overview.component';
import { AdminPacksComponent } from './sections/admin-packs.component';
import { AdminSettingsComponent } from './sections/admin-settings.component';
import { AdminUsersComponent } from './sections/admin-users.component';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: string;
  blocked?: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AdminOverviewComponent,
    AdminLandingComponent,
    AdminUsersComponent,
    AdminPacksComponent,
    AdminCoursesComponent,
    AdminSettingsComponent,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  error = '';
  success = '';
  apiStatus = 'ناخذو السيرفر...';
  loggedIn = false;
  loggingIn = false;
  sidebarOpen = false;
  activeSection: AdminSection = 'overview';
  adminName = 'أدمن';

  loginForm = { email: '', password: '' };

  readonly navItems: NavItem[] = [
    { id: 'overview', label: 'نظرة عامة', icon: '◉' },
    { id: 'landing', label: 'الصفحة الرئيسية', icon: '⌂' },
    { id: 'users', label: 'المستخدمين', icon: '👤', blocked: true },
    { id: 'packs', label: 'حزم الدروس', icon: '▣', blocked: true },
    { id: 'courses', label: 'الدورات', icon: '▶', blocked: true },
    { id: 'settings', label: 'الإعدادات', icon: '⚙' },
  ];

  constructor(
    private readonly api: ApiService,
    private readonly siteContent: SiteContentService,
    private readonly modalService: ModalService,
  ) {}

  get activeModal() {
    return this.modalService.activeModal;
  }

  ngOnInit(): void {
    this.checkBackend();
    this.restoreSession();
    this.siteContent.content$.subscribe((content) => {
      this.adminName = content.settings.fullName || 'أدمن';
    });
    this.siteContent.syncError$.subscribe((message) => {
      if (message) {
        this.error = message;
        this.success = '';
        this.modalService.error('خطأ في المزامنة', message);
      }
    });
  }

  restoreSession(): void {
    this.api.getMe().subscribe({
      next: ({ profile }) => {
        if (profile.is_admin) {
          this.loggedIn = true;
          this.loadCourses();
        }
      },
      error: () => {
        this.loggedIn = false;
      },
    });
  }

  checkBackend(): void {
    this.api.health().subscribe({
      next: (response) => {
        this.apiStatus = response.ok ? 'السيرفر موصول' : 'السيرفر موش متاح';
      },
      error: () => {
        this.apiStatus = 'السيرفر موش متاح';
      },
    });
  }

  loadCourses(): void {
    this.loading = true;
    this.api.getAdminCourses().subscribe({
      next: ({ courses }) => {
        this.loggedIn = true;
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.error || 'ما نجمناش نحمّلو الدورات.';
        this.loading = false;
        if (error.status === 401 || error.status === 403) {
          this.loggedIn = false;
        }
      },
    });
  }

  login(): void {
    if (!this.loginForm.email.trim() || !this.loginForm.password) {
      this.error = 'الإيميل وكلمة السر لازمتهم.';
      return;
    }

    this.loggingIn = true;
    this.error = '';
    this.success = '';

    const loginWatchdog = window.setTimeout(() => {
      if (this.loggingIn) {
        this.loggingIn = false;
        this.error = 'الدخول خذ وقت طويل. تحقق من الاتصال وحاول مجددًا.';
      }
    }, 15000);

    this.api.login(this.loginForm).subscribe({
      next: (response) => {
        window.clearTimeout(loginWatchdog);
        this.loggingIn = false;

        if (response.is_admin === false) {
          this.error = 'هذا الحساب موش أدمن.';
          this.api.logout().subscribe();
          return;
        }

        this.loggedIn = true;
        this.success = 'مرحبا بيك.';
        this.siteContent.refreshFromServer();
        this.loadCourses();
      },
      error: (error) => {
        window.clearTimeout(loginWatchdog);
        this.loggingIn = false;
        this.error =
          error.error?.error ||
          (error.status === 0
            ? 'ما نجمناش نوصلو للسيرفر. تحقق من الاتصال وحاول مجددًا.'
            : 'فشل الدخول.');
      },
    });
  }

  logout(): void {
    this.api.logout().subscribe({
      next: () => {
        this.loggedIn = false;
        this.courses = [];
        this.success = 'خرجت بنجاح.';
      },
      error: () => {
        this.loggedIn = false;
        this.courses = [];
      },
    });
  }

  selectSection(item: NavItem): void {
    if (item.blocked) {
      this.modalService.error('الولوج غير متاح', 'هذا القسم مغلق مؤقتاً بطلب من المشرف.');
      return;
    }
    this.activeSection = item.id;
    this.sidebarOpen = false;
  }

  handleNotify(event: { type: 'success' | 'error'; text: string }): void {
    if (event.type === 'success') {
      this.success = event.text;
      this.error = '';
      this.modalService.success('نجاح العملية', event.text);
    } else {
      this.error = event.text;
      this.success = '';
      this.modalService.error('خطأ', event.text);
    }
  }

  closeModal(result: boolean): void {
    this.modalService.close(result);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  get activeSectionLabel(): string {
    return this.navItems.find((item) => item.id === this.activeSection)?.label || 'لوحة التحكم';
  }
}

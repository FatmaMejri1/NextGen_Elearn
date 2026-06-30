import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LessonPack, ManagedUser, UserPackStatus } from '../../../models/site-content.models';
import { SiteContentService } from '../../../services/site-content.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent implements OnInit {
  @Output() notify = new EventEmitter<{ type: 'success' | 'error'; text: string }>();

  users: ManagedUser[] = [];
  packs: LessonPack[] = [];
  editingUser: ManagedUser | null = null;
  selectedUserId = '';

  readonly packStatuses: UserPackStatus[] = ['locked', 'available', 'paid', 'completed'];

  readonly statusLabels: Record<UserPackStatus, string> = {
    locked: 'مقفول',
    available: 'متاح',
    paid: 'مدفوع',
    completed: 'مكمّل',
  };

  statusLabel(status: UserPackStatus): string {
    return this.statusLabels[status];
  }

  constructor(
    private readonly siteContent: SiteContentService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.siteContent.content$.subscribe((content) => {
      this.users = structuredClone(content.users);
      this.packs = structuredClone(content.lessonPacks);
      if (!this.selectedUserId && this.users.length) {
        this.selectedUserId = this.users[0].id;
      }
    });
  }

  get selectedUser(): ManagedUser | undefined {
    return this.users.find((user) => user.id === this.selectedUserId);
  }

  startUser(user?: ManagedUser): void {
    this.editingUser = user ? structuredClone(user) : this.siteContent.createUserDraft();
  }

  getPackTitle(packId: string): string {
    return this.packs.find((pack) => pack.id === packId)?.title || 'Unknown pack';
  }

  getPackAccess(user: ManagedUser, packId: string) {
    return user.packAccess.find((entry) => entry.packId === packId);
  }

  setPackStatus(user: ManagedUser, packId: string, status: UserPackStatus): void {
    const access = user.packAccess.find((entry) => entry.packId === packId);
    if (!access) return;
    access.status = status;
    if (status === 'paid' || status === 'completed') {
      access.paidAt = new Date().toISOString();
    }
  }

  toggleLessonForUser(user: ManagedUser, lessonId: string): void {
    if (user.extraLessonIds.includes(lessonId)) {
      user.extraLessonIds = user.extraLessonIds.filter((id) => id !== lessonId);
    } else {
      user.extraLessonIds = [...user.extraLessonIds, lessonId];
    }
  }

  isLessonAssigned(user: ManagedUser, lessonId: string): boolean {
    return user.extraLessonIds.includes(lessonId);
  }

  async saveUser(): Promise<void> {
    if (!this.editingUser?.fullName.trim() || !this.editingUser.email.trim()) {
      this.notify.emit({ type: 'error', text: 'الاسم والإيميل لازمتهم.' });
      return;
    }
    const confirm = await this.modalService.confirm('تأكيد الحفظ', `تحب تحفظ هالمستخدم "${this.editingUser.fullName}"؟`);
    if (!confirm) return;

    this.siteContent.saveUser(this.editingUser);
    this.selectedUserId = this.editingUser.id;
    this.editingUser = null;
    this.notify.emit({ type: 'success', text: 'المستخدم تحفظ.' });
  }

  async saveSelectedUserAccess(): Promise<void> {
    const user = this.selectedUser;
    if (!user) return;
    const confirm = await this.modalService.confirm('تأكيد الحفظ', `تحب تحفظ صلاحيات الحزم للمستخدم "${user.fullName}"؟`);
    if (!confirm) return;

    this.siteContent.saveUser(user);
    this.notify.emit({ type: 'success', text: 'صلاحيات الحزم تحدّثت.' });
  }

  async deleteUser(id: string): Promise<void> {
    const user = this.users.find((u) => u.id === id);
    const confirm = await this.modalService.confirm('تأكيد الحذف', `تحب تحذف هالمستخدم "${user?.fullName || ''}"؟`);
    if (!confirm) return;

    this.siteContent.deleteUser(id);
    if (this.selectedUserId === id) {
      this.selectedUserId = this.users[0]?.id || '';
    }
    this.notify.emit({ type: 'success', text: 'المستخدم انحذف.' });
  }
}

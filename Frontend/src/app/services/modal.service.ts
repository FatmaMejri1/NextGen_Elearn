import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  type: 'confirm' | 'success' | 'error';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  resolve?: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  readonly activeModal = signal<ModalConfig | null>(null);

  confirm(title: string, message: string, confirmText = 'موافق', cancelText = 'إلغاء'): Promise<boolean> {
    return new Promise((resolve) => {
      this.activeModal.set({
        type: 'confirm',
        title,
        message,
        confirmText,
        cancelText,
        resolve,
      });
    });
  }

  success(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.activeModal.set({
        type: 'success',
        title,
        message,
        resolve,
      });
    });
  }

  error(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.activeModal.set({
        type: 'error',
        title,
        message,
        resolve,
      });
    });
  }

  close(result: boolean) {
    const current = this.activeModal();
    this.activeModal.set(null);
    if (current?.resolve) {
      current.resolve(result);
    }
  }
}

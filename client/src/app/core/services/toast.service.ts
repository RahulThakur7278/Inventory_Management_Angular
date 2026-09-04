import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  showSuccess(message: string) {
    this.addToast('success', message);
  }

  showError(message: string) {
    this.addToast('error', message);
  }

  showInfo(message: string) {
    this.addToast('info', message);
  }

  removeToast(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  private addToast(type: 'success' | 'error' | 'info', message: string) {
    const id = Math.random().toString(36).substring(2, 9);
    this.toasts.update(current => [...current, { id, type, message }]);
    setTimeout(() => this.removeToast(id), 3000);
  }
}

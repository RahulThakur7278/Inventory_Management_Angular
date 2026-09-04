import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div [ngClass]="{
            'bg-green-100 border-green-500 text-green-700': toast.type === 'success',
            'bg-red-100 border-red-500 text-red-700': toast.type === 'error',
            'bg-blue-100 border-blue-500 text-blue-700': toast.type === 'info'
          }" 
          class="border-l-4 p-4 rounded shadow-md min-w-[300px] flex justify-between items-center transition-all">
          <div>
            <p class="font-bold capitalize">{{toast.type}}</p>
            <p class="text-sm">{{toast.message}}</p>
          </div>
          <button (click)="toastService.removeToast(toast.id)" class="text-gray-500 hover:text-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}

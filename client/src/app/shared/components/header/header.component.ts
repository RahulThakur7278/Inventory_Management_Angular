import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <button (click)="layoutService.toggleSidebar()" class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-gray-800">Admin Portal</h2>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {{ userEmail?.charAt(0)?.toUpperCase() }}
          </div>
          <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ userEmail }}</span>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  layoutService = inject(LayoutService);
  userEmail = this.authService.currentUser()?.email;
}

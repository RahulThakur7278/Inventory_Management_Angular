import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="bg-white shadow-sm h-16 flex items-center justify-between px-6 border-b border-gray-200">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Admin Portal</h2>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {{ userEmail?.charAt(0)?.toUpperCase() }}
          </div>
          <span class="text-sm font-medium text-gray-700 hidden md:block">{{ userEmail }}</span>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  userEmail = this.authService.currentUser()?.email;
}

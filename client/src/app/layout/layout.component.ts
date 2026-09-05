import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { LayoutService } from '../core/services/layout.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      
      <!-- Mobile Sidebar Overlay -->
      @if (layoutService.sidebarOpen()) {
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden transition-opacity" 
             (click)="layoutService.closeSidebar()"></div>
      }
      
      <!-- Sidebar -->
      <div [class]="layoutService.sidebarOpen() ? 'translate-x-0' : '-translate-x-full md:translate-x-0'" 
           class="fixed md:static inset-y-0 left-0 z-30 w-64 transition duration-300 transform md:transform-none bg-gray-900 overflow-y-auto h-full">
        <app-sidebar class="block"></app-sidebar>
      </div>

      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <app-header></app-header>
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {
  layoutService = inject(LayoutService);
}

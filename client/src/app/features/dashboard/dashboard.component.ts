import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { DashboardStats } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
    </div>

    @if (isLoading) {
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    } @else if (stats) {
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Products Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transform transition duration-500 hover:scale-105 hover:shadow-lg">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Products</p>
            <p class="text-3xl font-bold text-gray-900">{{stats.totalProducts}}</p>
          </div>
        </div>

        <!-- Total Categories Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transform transition duration-500 hover:scale-105 hover:shadow-lg">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Categories</p>
            <p class="text-3xl font-bold text-gray-900">{{stats.totalCategories}}</p>
          </div>
        </div>

        <!-- Low Stock Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transform transition duration-500 hover:scale-105 hover:shadow-lg">
          <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Low Stock Items</p>
            <p class="text-3xl font-bold text-gray-900">{{stats.lowStockCount}}</p>
          </div>
        </div>
      </div>

      <!-- Low Stock Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900">Low Stock Alert (Qty < 10)</h3>
        </div>
        
        @if (stats.lowStockProducts.length > 0) {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (product of stats.lowStockProducts; track product._id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{product.name}}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{product.sku}}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ $any(product.category).name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {{product.quantity}}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="px-6 py-8 text-center text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">All products are well stocked.</p>
          </div>
        }
      </div>
    }
  `
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  
  stats: DashboardStats | null = null;
  isLoading = true;

  ngOnInit() {
    this.productService.getDashboardStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}

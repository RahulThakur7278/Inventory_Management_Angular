import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product, Category } from '../../../core/models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Products</h1>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="relative">
          <input type="text" [formControl]="searchControl" placeholder="Search products..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <button (click)="openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Add Product
        </button>
      </div>
    </div>

    <!-- Product List Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @if (isLoading) {
              <tr><td colspan="5" class="px-6 py-10 text-center text-gray-500">Loading products...</td></tr>
            } @else if (products.length === 0) {
              <tr><td colspan="5" class="px-6 py-10 text-center text-gray-500">No products found.</td></tr>
            } @else {
              @for (product of products; track product._id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-col">
                      <span class="text-sm font-medium text-gray-900">{{product.name}}</span>
                      <span class="text-xs text-gray-500">SKU: {{product.sku}}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {{ $any(product.category).name }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    \${{product.sellingPrice}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [ngClass]="product.quantity < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                      {{product.quantity}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button (click)="openModal(product)" class="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                    <button (click)="deleteProduct(product._id)" class="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    @if (isModalOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeModal()"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
            <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start w-full">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-bold text-gray-900 border-b pb-3" id="modal-title">
                      {{ editingId ? 'Edit Product' : 'Add Product' }}
                    </h3>
                    
                    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700">Product Name</label>
                        <input type="text" formControlName="name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700">SKU (Unique)</label>
                        <input type="text" formControlName="sku" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700">Category</label>
                        <select formControlName="category" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
                          <option value="">Select a category</option>
                          @for (cat of categories; track cat._id) {
                            <option [value]="cat._id">{{cat.name}}</option>
                          }
                        </select>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700">Purchase Price</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span class="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input type="number" formControlName="purchasePrice" class="pl-7 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0.00">
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700">Selling Price</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span class="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input type="number" formControlName="sellingPrice" class="pl-7 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0.00">
                        </div>
                      </div>

                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700">Quantity in Stock</label>
                        <input type="number" formControlName="quantity" class="mt-1 block w-full md:w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
                <button type="submit" [disabled]="productForm.invalid || isSaving" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors">
                  {{ isSaving ? 'Saving...' : 'Save Product' }}
                </button>
                <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class ProductListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  products: Product[] = [];
  categories: Category[] = [];
  isLoading = true;
  isModalOpen = false;
  isSaving = false;
  editingId: string | null = null;
  
  searchControl = new FormControl('');

  productForm = this.fb.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    category: ['', Validators.required],
    purchasePrice: [0, [Validators.required, Validators.min(0)]],
    sellingPrice: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(keyword => {
      this.loadProducts(keyword || undefined);
    });
  }

  loadProducts(keyword?: string) {
    this.isLoading = true;
    this.productService.getProducts(keyword).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  openModal(product?: Product) {
    this.isModalOpen = true;
    if (product) {
      this.editingId = product._id;
      this.productForm.patchValue({
        name: product.name,
        sku: product.sku,
        category: (product.category as Category)._id || product.category as string,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        quantity: product.quantity
      });
    } else {
      this.editingId = null;
      this.productForm.reset({ purchasePrice: 0, sellingPrice: 0, quantity: 0, category: '' });
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingId = null;
    this.productForm.reset();
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isSaving = true;
      const data = this.productForm.value as Partial<Product>;

      const request = this.editingId 
        ? this.productService.updateProduct(this.editingId, data)
        : this.productService.createProduct(data);

      request.subscribe({
        next: () => {
          this.toastService.showSuccess(`Product successfully ${this.editingId ? 'updated' : 'created'}!`);
          this.closeModal();
          this.loadProducts();
          this.isSaving = false;
        },
        error: () => {
          this.isSaving = false;
        }
      });
    }
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toastService.showSuccess('Product deleted successfully');
          this.loadProducts();
        }
      });
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product, DashboardStats } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private dashboardUrl = `${environment.apiUrl}/dashboard/stats`;

  constructor(private http: HttpClient) {}

  getProducts(keyword?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.dashboardUrl);
  }
}

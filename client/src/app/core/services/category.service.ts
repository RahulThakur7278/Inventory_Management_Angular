import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Category } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, data);
  }

  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

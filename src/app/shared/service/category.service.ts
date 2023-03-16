import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { Category } from '../tables/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/categories`;

  constructor(private httpClient: HttpClient) { }

  getCategories(): Observable<Category[]> {
    console.log(`getting jwt-token from Storage`, localStorage.getItem('jwt-token'));
    const categories = this.httpClient.get<Category[]>(this.baseUrl);
    return categories;
  }
}

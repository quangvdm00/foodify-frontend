import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../tables/Product';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private baseUrl = `${environment.foodOrderingBaseApiUrl}/products`;

    constructor(private httpClient: HttpClient) {
    }

    addProduct(product: Product) {
        return this.httpClient.post<Product>(this.baseUrl, product);
    }

    getProductsPagination(thePage: number, thePageSize: number): Observable<GetResponseProducts> {
        console.log(`getting jwt-token from Storage`, localStorage.getItem('jwt-token'));
        return this.httpClient.get<GetResponseProducts>(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`);
    }
}

interface GetResponseProducts {
    products: Product[];
    page: {
        pageNo: number,
        pageSize: number,
        totalElements: number,
        totalPages: number,
    };
}

import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../tables/Product';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private baseUrl = `${environment.foodOrderingBaseApiUrl}/products`;

    constructor(private httpClient: HttpClient) {
    }

    getProducts(): Observable<Product[]> {
        console.log(`getting jwt-token from Storage`, localStorage.getItem('jwt-token'));
        const products = this.httpClient.get<GetResponseProducts>(this.baseUrl)
            .pipe(
                map((response: GetResponseProducts) => response.products)
            );
        console.log(products);
        return this.httpClient.get<GetResponseProducts>(this.baseUrl)
            .pipe(
                map((response: GetResponseProducts) => response.products)
            );
    }
}

interface GetResponseProducts {
    products: Product[];
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    };
}

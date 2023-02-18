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
        return this.httpClient.get<GetResponseProducts>(this.baseUrl)
            .pipe(
                map((response: GetResponseProducts) => response._embedded.products)
            );
    }
}

interface GetResponseProducts {
    _embedded: {
        products: Product[]
    },
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}

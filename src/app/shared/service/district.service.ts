import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { District } from '../tables/district';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private districtUrl = `${environment.foodOrderingBaseApiUrl}/districts`

  constructor(private httpClient: HttpClient) { }

  getDistrictList(): Observable<District[]> {
    return this.httpClient.get<District[]>(this.districtUrl)
  }
}

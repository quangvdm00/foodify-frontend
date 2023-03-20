import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { Ward } from '../tables/ward';

@Injectable({
  providedIn: 'root'
})
export class WardService {

  private districtUrl = `${environment.foodOrderingBaseApiUrl}/districts`

  constructor(private httpClient: HttpClient) { }

  getWardList(districtId:string): Observable<Ward[]> {
    return this.httpClient.get<Ward[]>(`${this.districtUrl}/${districtId}/wards`)
  }
  
}

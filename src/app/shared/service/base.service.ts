import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs-compat";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export abstract class BaseService {
  public _url = environment.foodOrderingBaseApiUrl;

  constructor(private httpClient: HttpClient) {}

  public http = this.httpClient;
}

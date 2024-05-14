import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, delay, first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  isAuthenticated: boolean = false;

  private readonly API = 'http://localhost:8800';

  constructor(private httpClient: HttpClient) { }

  list(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API}/getcustomersByPage`);
  }

  filterByCategory(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.API}/filterCategory`, data);
  }

  getCategorias(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:8800/getCategorias');
  }
}

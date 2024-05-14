import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }
  
  createEstabelecimento(estabelecimentoData: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8800/creatEstabelicimento', estabelecimentoData);
  }
  
  getCustomers(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:8800/getcustomers');
  }

  getCategorias(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:8800/getCategorias');
  }

  getRoles(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:8800/getRoles');
  }

  deleteEstabelecimento(deletedCustomer: any): Observable<any> {
    return this.httpClient.put<any>('http://localhost:8800/deleteCustomer', deletedCustomer);
  }

  getAddressByCep(cep: string): Observable<any> {
    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
    return this.httpClient.get(apiUrl);
  }

  editEstabelecimento(editCustomer: any): Observable<any> {
    return this.httpClient.put<any>('http://localhost:8800/editCustomer', editCustomer);
  }

  getCustumerById(id: number): Observable<any[]> {
    const url = `http://localhost:8800/getcustomersById/${id}`;
    return this.httpClient.get<any[]>(url);
  }

  private formEditValuesSource = new BehaviorSubject<any>(null);
  formEditValues$ = this.formEditValuesSource.asObservable();

  setFormEditValues(values: any) {
    this.formEditValuesSource.next(values);
  }

  getStatus(id: number): Observable<any[]> {
    const url = `http://localhost:8800/getStatus/${id}`;
    return this.httpClient.get<any[]>(url);
  }

  setStatus(status: any): Observable<any> {
    return this.httpClient.put<any>('http://localhost:8800/deleteCustomer', status);
  }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post('sua/url/de/upload', formData);
  }
  
  getProfilePicture(id: number): Observable<any[]>{
    const url = `http://localhost:8800/getProfilePicture/${id}`;
    return this.httpClient.get<any[]>(url);
  }

  getFotos(id: number): Observable<any[]>{
    const url = `http://localhost:8800/getFotos/${id}`;
    return this.httpClient.get<any[]>(url);
  }

  editProfilePicture(editProfilePicture: any): Observable<any> {
    return this.httpClient.put<any>('http://localhost:8800/editProfilePicture', editProfilePicture);
  }
  
  addphotos(fotos: any): Observable<any>{
    return this.httpClient.put<any>('http://localhost:8800/editPhotos', fotos);
  }

  deleteImage(value: any): Observable<any[]>{
    return this.httpClient.put<any[]>(`http://localhost:8800/deleteImage`, value)
  }
}

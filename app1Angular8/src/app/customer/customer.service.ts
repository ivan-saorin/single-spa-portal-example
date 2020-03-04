import { Customer } from './customer';
import { CustomerFilter } from './customer-filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class CustomerService {
  customerList: Customer[] = [];

  constructor(private http: HttpClient) {
  }

  findById(id: string): Observable<Customer> {
    const url = `http://localhost:3200/customers/${id}`;
    const params = { 'id': id };
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.get<Customer>(url, {params, headers});
  }

  load(filter: CustomerFilter): void {
    this.find(filter).subscribe(result => {
        this.customerList = result;
      },
      err => {
        console.error('error loading', err);
      }
    );
  }

  find(filter: CustomerFilter): Observable<Customer[]> {
    const url = `http://localhost:3200/customers`;
    const headers = new HttpHeaders().set('Accept', 'application/json');

    const params = {
      'from': filter.from,
      'to': filter.to,
    };

    return this.http.get<Customer[]>(url, {params, headers});
  }

  save(entity: Customer): Observable<Customer> {
    let params = new HttpParams();
    let url = '';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    if (entity.id) {
      url = `http://localhost:3200/customers/${entity.id.toString()}`;
      params = new HttpParams().set('ID', entity.id.toString());
      return this.http.put<Customer>(url, entity, {headers, params});
    } else {
      url = `http://localhost:3200/customers`;
      return this.http.post<Customer>(url, entity, {headers, params});
    }
  }

  delete(entity: Customer): Observable<Customer> {
    let params = new HttpParams();
    let url = '';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    if (entity.id) {
      url = `http://localhost:3200/customers/${entity.id.toString()}`;
      params = new HttpParams().set('ID', entity.id.toString());
      return this.http.delete<Customer>(url, {headers, params});
    }
    return null;
  }
}


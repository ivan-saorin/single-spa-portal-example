import { Product } from './product';
import { ProductFilter } from './product-filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class ProductService {
  private baseUrl: string = 'http://localhost:3200';
  productList: Product[] = [];

  constructor(private router: Router, private http: HttpClient) {
  }

  findById(id: string): Observable<Product> {
    const url = `${this.baseUrl}/products/${id}`;
    const params = { 'id': id };
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.get<Product>(url, {params, headers});
  }

  load(filter: ProductFilter): void {
    this.find(filter).subscribe(result => {
        this.productList = result;
      },
      err => {
        console.error('error loading', err);
        if (err.status && err.status === 401) {
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  find(filter: ProductFilter): Observable<Product[]> {
    const url = `${this.baseUrl}/products`;
    const headers = new HttpHeaders().set('Accept', 'application/json');

    /*
    const params = {
      'from': filter.from,
      'to': filter.to,
    };
    */
   const params = {};

    return this.http.get<Product[]>(url, {params, headers});
  }

  save(entity: Product): Observable<Product> {
    let params = new HttpParams();
    let url = '';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    if (entity.id) {
      url = `${this.baseUrl}/products/${entity.id.toString()}`;
      params = new HttpParams().set('ID', entity.id.toString());
      return this.http.put<Product>(url, entity, {headers, params});
    } else {
      url = `${this.baseUrl}/products`;
      return this.http.post<Product>(url, entity, {headers, params});
    }
  }

  delete(entity: Product): Observable<Product> {
    let params = new HttpParams();
    let url = '';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    if (entity.id) {
      url = `${this.baseUrl}/products/${entity.id.toString()}`;
      params = new HttpParams().set('ID', entity.id.toString());
      return this.http.delete<Product>(url, {headers, params});
    }
    return null;
  }
}


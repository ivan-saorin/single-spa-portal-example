import { Flight } from './flight';
import { FlightFilter } from './flight-filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtService } from '../jwt.service';

@Injectable()
export class FlightService {
  private baseUrl: string = 'http://localhost:3200';
  flightList: Flight[] = [];

  constructor(private router: Router, private http: HttpClient, private jwtService: JwtService) {
  }

  findById(id: string): Observable<Flight> {
    const url = `${this.baseUrl}/flights/${id}`;
    const params = { 'id': id };
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.jwtService.accessToken}`);
    return this.http.get<Flight>(url, {params, headers});
  }

  load(filter: FlightFilter): void {
    this.find(filter).subscribe(result => {
        this.flightList = result;
      },
      err => {
        console.error('error loading', err);
        if (err.status && err.status === 401) {
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  find(filter: FlightFilter): Observable<Flight[]> {
    const url = `${this.baseUrl}/flights`;
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.jwtService.accessToken}`);

    const params = {};

    return this.http.get<Flight[]>(url, {params, headers});
  }

  save(entity: Flight): Observable<Flight> {
    let params = new HttpParams();
    let url = '';
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${this.jwtService.accessToken}`);
    if (entity.id) {
      url = `${this.baseUrl}/flights/${entity.id.toString()}`;
      params = new HttpParams().set('ID', entity.id.toString());
      return this.http.put<Flight>(url, entity, {headers, params});
    } else {
      url = `${this.baseUrl}/flights`;
      return this.http.post<Flight>(url, entity, {headers, params});
    }
  }

  delete(entity: Flight): Observable<Flight> {
    let params = new HttpParams();
    let url = '';
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${this.jwtService.accessToken}`);
    if (entity.id) {
      url = `${this.baseUrl}/flights/${entity.id.toString()}`;
      params = new HttpParams().set('ID', entity.id.toString());
      return this.http.delete<Flight>(url, {headers, params});
    }
    return null;
  }
}


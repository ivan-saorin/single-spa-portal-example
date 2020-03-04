import { Flight } from './flight';
import { FlightFilter } from './flight-filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class FlightService {
  flightList: Flight[] = [];

  constructor(private http: HttpClient) {
  }

  findById(id: string): Observable<Flight> {
    const url = `http://localhost:3200/flights/${id}`;
    const params = { 'id': id };
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.get<Flight>(url, {params, headers});
  }

  load(filter: FlightFilter): void {
    this.find(filter).subscribe(result => {
        this.flightList = result;
      },
      err => {
        console.error('error loading', err);
      }
    );
  }

  find(filter: FlightFilter): Observable<Flight[]> {
    const url = `http://localhost:3200/flights`;
    const headers = new HttpHeaders().set('Accept', 'application/json');

    const params = {};

    return this.http.get<Flight[]>(url, {params, headers});
  }

  save(entity: Flight): Observable<Flight> {
    let params = new HttpParams();
    let url = '';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    if (entity.id) {
      url = `http://localhost:3200/flights/${entity.id.toString()}`;
      params = new HttpParams().set('ID', entity.id.toString());
      return this.http.put<Flight>(url, entity, {headers, params});
    } else {
      url = `http://localhost:3200/flights`;
      return this.http.post<Flight>(url, entity, {headers, params});
    }
  }

  delete(entity: Flight): Observable<Flight> {
    let params = new HttpParams();
    let url = '';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    if (entity.id) {
      url = `http://localhost:3200/flights/${entity.id.toString()}`;
      params = new HttpParams().set('ID', entity.id.toString());
      return this.http.delete<Flight>(url, {headers, params});
    }
    return null;
  }
}


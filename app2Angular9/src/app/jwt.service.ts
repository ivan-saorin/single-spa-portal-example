import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './login/models';

@Injectable({
providedIn: 'root'
})

export class JwtService {
    private _accessToken: string = null;

    constructor(private httpClient: HttpClient, public jwtHelper: JwtHelperService) { }

    public isAuthenticated(): boolean {
        //const token = localStorage.getItem('access_token');
        const token = this.accessToken;
        // Check whether the token is expired and return
        // true or false
        return !this.jwtHelper.isTokenExpired(token);
    }   

    get accessToken() {
        return this._accessToken;
    }

    login(userInfo: User) {
        let user: string = userInfo.user;
        let p: string= userInfo.password;
        console.log('login ', user, p);
        /*
        let body = new FormData();
        body.set('user', user);
        body.set('password', p);
        */
       let body: any = {
          "user": user,
          "password": p
       }
        const httpOptions = {
            headers: new HttpHeaders({ 
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
            })
        };

        return this.httpClient.post<{access_token:  string}>('http://localhost:3200/auth/login', body, httpOptions).subscribe(
            res => {
                console.warn('login < access_token', res.access_token);
                //localStorage.setItem('access_token', res.access_token);
                this._accessToken = res.access_token;
                return {}; 
            },
            err => console.log(err)
        );
    }

    register(userInfo: User) {
        let user: string = userInfo.user;
        let p: string= userInfo.password;
        return this.httpClient.post<{access_token: string}>('http://localhost:3200/auth/register', {user, p}).pipe(tap(res => {
            console.warn('register < access_token', res.access_token);
            this.login(userInfo);
        }))
    }

    logout() {
        //localStorage.removeItem('access_token');
        this._accessToken = null;
    }

    public get loggedIn(): boolean{
        //return localStorage.getItem('access_token') !==  null;
        return this._accessToken !== null;
    }
}
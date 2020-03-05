import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './login/models';

@Injectable({
providedIn: 'root'
})

export class JwtService {
    constructor(private httpClient: HttpClient, public jwtHelper: JwtHelperService) { }

    public isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        // Check whether the token is expired and return
        // true or false
        return !this.jwtHelper.isTokenExpired(token);
    }   

    login(userInfo: User) {
        let user: string = userInfo.user;
        let p: string= userInfo.password;
        return this.httpClient.post<{access_token:  string}>('localhost:3200/auth/login', {user, p}).pipe(tap(res => {
            localStorage.setItem('access_token', res.access_token);
        }))
    }

    register(userInfo: User) {
        let user: string = userInfo.user;
        let p: string= userInfo.password;
        return this.httpClient.post<{access_token: string}>('localhost:3200/auth/register', {user, p}).pipe(tap(res => {
        this.login(userInfo);
    }))
    }

    logout() {
        localStorage.removeItem('access_token');
    }

    public get loggedIn(): boolean{
        return localStorage.getItem('access_token') !==  null;
    }
}
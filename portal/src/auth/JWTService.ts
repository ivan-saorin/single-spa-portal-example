import Axios from 'axios';
import { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
//import * as util from 'typed-rest-client/Util';

export interface HttpBinData {
    url: string;
    data: any;
    json: any;
    args?: any
}

export interface User {
    user: string;
    password: string;
}

export interface AccessToken {
    access_token: string;
}

export class JwtService {
    private axios: AxiosInstance;
    private _accessToken: string = null;

    constructor(private baseUrl: string) {
        const config: AxiosRequestConfig = {
            baseURL: this.baseUrl + '/auth',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        this.axios = Axios.create(config);
    }

    public isAuthenticated(): boolean {
        //const token = localStorage.getItem('access_token');
        const token = this.accessToken;
        if (token === null)
            return false;
        // Check whether the token is expired and return
        // true or false
        return !this.isTokenExpired(token, 60);
        //return !this.jwtHelper.isTokenExpired(token);
    }

    get accessToken() {
        return this._accessToken;
    }

    async login(userInfo: User) {
        console.log('login ', userInfo.user, userInfo.password);

        try {
            const response = await this.axios.post<AccessToken>('/login', userInfo);
            const result: AccessToken = response.data;
            console.warn('login < access_token', result.access_token);
            //localStorage.setItem('access_token', result.access_token);
            this._accessToken = result.access_token;

        }
        catch (err) {
            if (err && err.response) {
                const axiosError = err as AxiosError
                console.error(axiosError);
            }

            throw err;
        }
    }

    async register(userInfo: User) {
        console.log('register ', userInfo.user, userInfo.password);

        try {
            const response = await this.axios.post<AccessToken>('/register', userInfo);
            const result: AccessToken = response.data;
            console.warn('register < access_token', result.access_token);
            //localStorage.setItem('access_token', result.access_token);
            this._accessToken = result.access_token;
            this.login(userInfo);
        }
        catch (err) {
            if (err && err.response) {
                const axiosError = err as AxiosError;
                console.error(axiosError);
            }

            throw err;
        }
    }

    logout() {
        //localStorage.removeItem('access_token');
        this._accessToken = null;
    }

    public get loggedIn(): boolean {
        //return localStorage.getItem('access_token') !==  null;
        return this._accessToken !== null;
    }

    // From https://github.com/auth0/angular-jwt/blob/master/src/angularJwt/services/jwt.js

    private urlBase64Decode(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: { break; }
            case 2: { output += '=='; break; }
            case 3: { output += '='; break; }
            default: {
                throw 'Illegal base64url string!';
            }
        }
        return window.decodeURIComponent(escape(window.atob(output))); //polyfill https://github.com/davidchambers/Base64.js
    };

    private fromJson(json: any) {
        return (typeof json === "string") ? JSON.parse(json) : json;
    }

    private decodeToken(token: string): any {
        let parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        let decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return this.fromJson(decoded);
    }

    private getTokenExpirationDate(token: string): Date {
        var decoded = this.decodeToken(token);

        if (typeof decoded.exp === "undefined") {
            return null;
        }

        var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
        d.setUTCSeconds(decoded.exp);

        return d;
    };

    private isTokenExpired(token: string, offsetSeconds?: number): boolean {
        var d = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (d === null) {
            return false;
        }

        // Token expired?
        return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    };
}
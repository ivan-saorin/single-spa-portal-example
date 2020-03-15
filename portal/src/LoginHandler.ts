import * as utils from './utils';
import { Router } from './Router';
import { Routes } from './Routes';
import { UIHandler } from './UIHandler';
import { ModuleHandler } from './ModuleHandler';
import { JwtService, User } from './auth/JWTService';


export default class LoginHandler extends ModuleHandler{
    constructor(uiHandler: UIHandler, router: Router, routes: Routes, private jwt: JwtService) {
        super(uiHandler, router, routes, 'login');
    }

    protected attachEvents(): void {
        let button = document.getElementById('submit');
        button.removeEventListener('click', this.clickHandler);
        button.addEventListener('click', this.clickHandler);
    }
    protected detachEvents(): void {
        let button = document.getElementById('submit');
        button.removeEventListener('click', this.clickHandler);
    }

    private submit() {
        console.log('[HOST] login form submit');
        let userEl = document.getElementById('user') as HTMLInputElement;
        let passwordEl = document.getElementById('password') as HTMLInputElement;

        let userInfo: User = {
            user: userEl.value,
            password: passwordEl.value
        }

        this.jwt.login(userInfo).then(() => {
            userEl.value = '';
            passwordEl.value = '';
            this.uiHandler.completePreviousNavigation();    
        }, (rejection) => {
            userEl.value = '';
            passwordEl.value = '';
        });
    }

    private clickHandler = (event: any) =>  {
        console.log('[HOST] login click', event.target);
        event.preventDefault();

        this.submit();
    }

}
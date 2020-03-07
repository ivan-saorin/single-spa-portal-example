import * as utils from './utils';
import { Router } from './Router';
import { Routes } from './Routes';
import { UIHandler } from './UIHandler';
import { ModuleHandler } from './ModuleHandler';


export default class LoginHandler extends ModuleHandler{
    constructor(uiHandler: UIHandler, router: Router, document: Document, routes: Routes) {
        super(uiHandler, router, document, routes, 'login');
    }

    protected attachEvents(): void {
        let el = this.getSelectorEl();
        let form = el.querySelector('form');
        form.removeEventListener('submit', this.submitHandler);
        form.addEventListener('submit', this.submitHandler);

        let button = document.getElementById('submit');
        button.removeEventListener('click', this.clickHandler);
        button.addEventListener('click', this.clickHandler);
    }
    protected detachEvents(): void {
        let el = this.getSelectorEl();
        let form = el.querySelector('form');
        form.removeEventListener('submit', this.submitHandler);

        let button = document.getElementById('submit');
        button.removeEventListener('click', this.clickHandler);
    }

    private submitHandler(event: any) {
        console.log('login form submit');
    }

    private clickHandler = (event: any) =>  {
        console.log('login click', event.target);
        let el = this.getSelectorEl();
        let form = el.querySelector('form');
        form.submit();
    }

}
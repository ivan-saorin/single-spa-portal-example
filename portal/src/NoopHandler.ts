import * as utils from './utils';
import { Router } from './Router';
import { Routes } from './Routes';
import { UIHandler } from './UIHandler';
import { ModuleHandler } from './ModuleHandler';


export default class LoginHandler extends ModuleHandler{
    constructor(uiHandler: UIHandler, router: Router, document: Document, routes: Routes) {
        super(uiHandler, router, routes, 'undefined');
    }

    protected attachEvents(): void {
        // Noop
    }
    protected detachEvents(): void {
        // Noop
    }

}
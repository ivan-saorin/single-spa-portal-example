import { Routes } from './Routes';
import { ModuleHandler } from './ModuleHandler';
import { Mediator } from './Mediator';


export default class LoginHandler extends ModuleHandler{
    constructor(mediator: Mediator, routes: Routes) {
        super(mediator, routes, 'undefined');
    }

    protected attachEvents(): void {
        // Noop
    }
    protected detachEvents(): void {
        // Noop
    }

}
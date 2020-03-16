import { Routes, Target } from "./Routes";
import { Router } from './Router';
import { UIHandler } from './UIHandler';
import { AuthGuard } from './auth/AuthGuard';
import { Dispatcher } from './Dispatcher';

export class Navigation {
    constructor (private dispatcher: Dispatcher, private router: Router, public routes: Routes, private uiHandler: UIHandler, private auth: AuthGuard) {        
        this.uiHandler = uiHandler;        
        console.groupCollapsed('[HOST] Routes:');
        let log: any[] = [];
        for (const key in routes) {
            log.push(this.logRow(key, routes[key]))
            this.addRoute(key, routes[key]);
        }
        console.table(log);
        console.groupEnd();
        this.router.run();
    }

    private logRow(key: string, target: Target): any {
        let result: any;
        let type: string = target.external ? 'external' : target.internal ? 'internal' : target.redirect ? 'redirect' : 'unknown';
        result = {key, type, ...(target.external ? target.external : target.internal ? target.internal : target.redirect ? target.redirect : {})};
        return result;
    }

    private addRoute(route: string, target: Target) {        
        let fx = target.redirect ? 
            this.uiHandler.handleRedirectPath : target.internal ? 
                this.uiHandler.handleInternalPath : target.external ? 
                    this.uiHandler.handleExternalPath : null;
        if (fx == null) {
            throw new TypeError('Invalid target value: [' + target + ']');
        }

        //console.log('[HOST] addind route: ', route, target);
        this.router.add(route, fx);
        if (fx == this.uiHandler.handleExternalPath ) {
            //console.log('[HOST] addind route: ', route + '/*', target);
            this.router.add(route + '/*', fx);
        }
    }

    navigate(path: string): void {
        this.router.navigate(path);
    }

    path(): string {
        return this.router.getCurrentPath();
    }

}

export default Navigation;
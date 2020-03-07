import { Routes, Target } from "./Routes";
import { Router } from './Router';
import { UIHandler } from './UIHandler';
import { AuthGuard } from './auth/AuthGuard';

export class Navigation {
    constructor (private router: Router, public routes: Routes, private uiHandler: UIHandler, private auth: AuthGuard) {        
        this.uiHandler = uiHandler;
        
        for (const key in routes) {
            //console.log('key: ', key, routes[key]);
            this.addRoute(key, routes[key]);
        }
        this.router.run();
    }

    private guardedFx(callback: any) {
        if (!this.auth.canActivate()) {
            return this.gotoLogin();
        }
        return callback;
    }

    private gotoLogin() {
        this.router.navigate('/login');
    }

    private addRoute(route: string, target: Target) {        
        let fx = target.redirect ? 
            this.uiHandler.handleRedirectPath : target.internal ? 
                this.uiHandler.handleInternalPath : target.external ? 
                    this.uiHandler.handleExternalPath : null;
        if (fx == null) {
            throw new TypeError('Invalid target value: [' + target + ']');
        }

        /*
        fx = (target.internal && target.internal.guarded) ? 
        this.guardedFx(fx) : (target.external && target.external.guarded) ? 
            this.guardedFx(fx) : fx;
        */

        //console.log('addind route: ', route, target);
        this.router.add(route, fx);
        if (fx == this.uiHandler.handleExternalPath ) {
            //console.log('addind route: ', route + '/*', target);
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
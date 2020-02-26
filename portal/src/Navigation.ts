import { Routes, Target } from "./routes";
import { Router, RouterMode } from './router';
import { UIHandler } from './uiHandler';


export class Navigation {
    constructor (private router: Router, public routes: Routes, private uiHandler: UIHandler) {
        // History mode do not support loading the app throug the direct change of the url in the navigation bar of the browser. Let's use Hash mode instead.
        // this.router = new Router(RouterMode.History);
        this.uiHandler = uiHandler;

        
        for (const key in routes) {
            //console.log('key: ', key, routes[key]);
            this.addRoute(key, routes[key]);
        }

        /*
        this.router.add('/', uiHandler.handleRedirectPath);
        this.router.add('/home', uiHandler.handleInternalPath);
        this.router.add('/login', uiHandler.handleInternalPath);
        this.router.add('/contact', uiHandler.handleRedirectPath);
        this.router.add('/app1Angular8', uiHandler.handleExternalPath);
        this.router.add('/app2Angular9', uiHandler.handleExternalPath);
        this.router.add('/app3Vue', uiHandler.handleExternalPath);
        this.router.add('/app4React', uiHandler.handleExternalPath);
        */
        this.router.run();
    }

    private addRoute(route: string, target: Target) {        
        let fx = target.redirect ? 
            this.uiHandler.handleRedirectPath : target.internal ? 
                this.uiHandler.handleInternalPath : target.external ? 
                    this.uiHandler.handleExternalPath : null;
        if (fx == null) {
            throw new TypeError('Invalid target value: [' + target + ']');
        }
        //console.log('target: ', target);
        this.router.add(route, fx);
        if (fx == this.uiHandler.handleExternalPath ) {
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
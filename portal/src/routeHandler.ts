import { Routes } from "./routes";
import { Router, RouterMode } from './router';
import { UIHandler } from './uiHandler';


export class RouteHandler {
    private router: Router;
    constructor (public routes: Routes, private uiHandler: UIHandler) {
        // History mode do not support loading the app throug the direct change of the url in the navigation bar of the browser. Let's use Hash mode instead.
        // this.router = new Router(RouterMode.History);
        this.uiHandler = uiHandler;
        this.router = new Router(RouterMode.Hash);

        console.log(this.router);

        this.router.add('/home', uiHandler.handlePage);
        this.router.add('/login', uiHandler.handlePage);
        this.router.add('/app1Angular8', uiHandler.handleRoute);
        this.router.add('/app2Angular9', uiHandler.handleRoute);
        this.router.add('/app3Vue', uiHandler.handleRoute);
        this.router.add('/app4React', uiHandler.handleRoute);
        this.router.run();
    }

    navigate(path: string): void {
        this.router.navigate(path);
    }

    path(): string {
        throw new Error("Method not implemented.");
    }



}

export default RouteHandler;
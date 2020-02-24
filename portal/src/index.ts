import './styles/style.scss';
import { Routes } from './routes';
import { RouteHandler } from './routeHandler';
import { UIHandler } from './uiHandler';


const routes: Routes = {
    "/": {
        "redirect": {
            "url": "/home",
            "target": "@self"
        }
    },
    "/home": {
        "internal": {
            "default": true,
            "target": "@self"
        }
    },
    "/login": {
        "internal": {
            "target": "@self"
        }
    },
    "/app1Angular8": {
        "external": {
            "url": "http://localhost:4001/",
            "target": "content"
        }
    },
    "/app2Angular9": {
        "external": {
            "url": "http://localhost:4002/",
            "target": "content"
        }
    },
    "/app3Vue": {
        "external": {
            "url": "http://localhost:4003/",
            "target": "content"
        }
    },
    "/app4React": {
        "external": {
            "url": "http://localhost:4004/",
            "target": "content"
        }
    }
};



let uiHandler = new UIHandler(document);
let routeHandler = new RouteHandler(routes, uiHandler);

uiHandler.setRouter(routeHandler);
uiHandler.init();


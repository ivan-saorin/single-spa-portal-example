import './styles/style.scss';
import { Routes } from './Routes';
import { Router, RouterMode } from './Router';
import { Navigation } from './Navigation';
import { UIHandler } from './UIHandler';
import { AuthGuard } from './auth/AuthGuard';
import { JwtService } from './auth/JWTService';
import { Mediator } from './Mediator';
import { GuestsHandler } from './GuestsHandler';
import * as utils from './Utils';

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
    "/contact": {
        "internal": {
            "target": "@self"
        }
    },
    "/protected": {
        "internal": {
            "target": "@self",
            "guarded": true
        }
    },
    "/app1Angular8": {
        "external": {
            "url": "http://localhost:4001/",
            "target": "content",
            "guarded": true
        }
    },
    "/app2Angular9": {
        "external": {
            "url": "http://localhost:4002/",
            "target": "content",
            "guarded": true
        }
    },
    "/app2Angular9/flights": {
        "external": {
            "url": "http://localhost:4002/flights",
            "target": "content",
            "guarded": true
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
            "target": "content",
            "guarded": true
        }
    }
};

let baseUrl = 'http://localhost:3200';

// History mode do not support loading the app throug the direct change of the url in the navigation bar of the browser. Let's use Hash mode instead.
let mediator = new Mediator();
let jwt = new JwtService(mediator, baseUrl);
let guests = new GuestsHandler(mediator);
let router = new Router(mediator, RouterMode.Hash);
let auth = new AuthGuard(mediator, jwt, router, routes);
let uiHandler = new UIHandler(mediator, routes, auth);
let navigation = new Navigation(mediator, router, routes, uiHandler, auth);
uiHandler.init();

/*
(async () => {    
    await navigation.navigate('/contacts');
    console.log('path:', await navigation.path());
})();
*/


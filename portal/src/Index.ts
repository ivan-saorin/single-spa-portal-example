import './styles/style.scss';
import { Routes } from './Routes';
import { Router, RouterMode } from './Router';
import { Navigation } from './Navigation';
import { UIHandler } from './UIHandler';
//import { LoginHandler } from './LoginHandler';
import { AuthGuard } from './auth/AuthGuard';
import { JwtService } from './auth/JWTService';
//import { Mediator } from './Mediator';


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
            "target": "content"
        }
    }
};

let baseUrl = 'http://localhost:3200';
let jwt = new JwtService(baseUrl);
let router = new Router(RouterMode.Hash);
let auth = new AuthGuard(jwt, router);
let uiHandler = new UIHandler(router, document, routes);
new Navigation(router, routes, uiHandler, auth);
uiHandler.init();

/*
let mediator = new Mediator();

mediator.subscribe('test.topic', (context: any, message: any) => {
    console.warn('test.topic', message);
})

mediator.publish('test.topic', {test: 'toast'}).then((message: any) => {
    console.warn('1 test.topic received', message);
}, (rejected: any) => {
    console.warn('1 test.topic rejected', rejected);
});

mediator.publish('test.topic', {test: 'toast'}).then((message: any) => {
    console.warn('2 test.topic received', message);
}, (rejected: any) => {
    console.warn('2 test.topic rejected', rejected);
});

mediator.publish('test.topic2', {test: 'should not receive'}).then((message: any) => {
    console.warn('test.topic2 received', message);
}, (rejected: any) => {
    console.warn('test.topic2 rejected', rejected);
});
*/
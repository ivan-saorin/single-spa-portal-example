import './styles/style.scss';
import { Routes } from './routes';
import { Router, RouterMode } from './router';
import { Navigation } from './Navigation';
import { UIHandler } from './uiHandler';
import { Mediator } from './Mediator';


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
    "/app2Angular9/flights": {
        "external": {
            "url": "http://localhost:4002/flights",
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


let router = new Router(RouterMode.Hash);
let uiHandler = new UIHandler(router, document, routes);
let navigation = new Navigation(router, routes, uiHandler);
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
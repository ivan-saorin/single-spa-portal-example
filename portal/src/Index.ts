import './styles/style.scss';
import { Routes } from './Routes';
import { Router, RouterMode } from './Router';
import { Navigation } from './Navigation';
import { UIHandler } from './UIHandler';
import { AuthGuard } from './auth/AuthGuard';
import { JwtService } from './auth/JWTService';
import { Mediator } from './Mediator';
import { Dispatcher } from './Dispatcher';
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
let jwt = new JwtService(baseUrl);

// History mode do not support loading the app throug the direct change of the url in the navigation bar of the browser. Let's use Hash mode instead.
let mediator = new Mediator();
let dispatcher = new Dispatcher(mediator);
let router = new Router(RouterMode.Hash);
let auth = new AuthGuard(dispatcher, jwt, router, routes);
let uiHandler = new UIHandler(dispatcher, router, routes, jwt, auth);
new Navigation(dispatcher, router, routes, uiHandler, auth);
uiHandler.init();

mediator.subscribe('request.my-personal-topic', async (context: any, message: any) => {
    console.log('[HOST] received request for request.my-personal-topic', message);    
    let response = mediator.prepareResponse(message, {'this': `is the response at message Id [${message.$id}]`});
    try {
        await mediator.publish(message.$rsvpChannel, response);
        console.log('[HOST] response to response.my-personal-topic sent');
    } catch (error) {
        console.error('[HOST] response to response.my-personal-topic not sent');
    }      
});

(async () => {
    try {
        let response = await mediator.request('my-personal-topic', {'message': 'in a bottle'});
        console.info('received response 1', response);
    } catch(error) {
        console.error(error);
    }
    try {
        let response2 = await mediator.request('my-specific-topic', {'message': 'in a bottle'});
        console.info('received response 2', response2);
    } catch(error) {
        console.error(error);
    }
})();

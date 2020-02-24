import './styles/style.scss';
import * as utils from './Utils';
import { Router, RouterMode } from "./router";

const microFrontendsByRoute: any = {
    '/app1Angular8': 'http://localhost:4001/',
    '/app2Angular9': 'http://localhost:4002/',
    '/app3Vue': 'http://localhost:4003/',
    '/app4React': 'http://localhost:4004/'
};

const routes: any = {
    '/': {
        'redirect': {
            'url': '/home',
            'target': '@self'
        }
    },
    '/home': {
        'internal': {
            'default': true,
            'target': '@self'
        }
    },
    '/login': {
        'internal': {
            'target': '@self'
        }
    },
    '/app1Angular8': {
        'external': {
            'url': 'http://localhost:4001/',
            'target': 'content'
        }
    },
    '/app2Angular9': {
        'external': {
            'url': 'http://localhost:4002/',
            'target': 'content'
        }
    },
    '/app3Vue': {
        'external': {
            'url': 'http://localhost:4003/',
            'target': 'content'
        }
    },
    '/app4React': {
        'external': {
            'url': 'http://localhost:4004/',
            'target': 'content'
        }
    }
};


const errorTimeoutValue: number = 7000;

// History mode do not support loading the app throug the direct change of the url in the navigation bar of the browser. Let's use Hash mode instead.
// let router = new Router(RouterMode.History);
let router = new Router(RouterMode.Hash, {root: '/home', removeDomain: false});

console.log(router);
let errorTimeout: number;


function getBasePathEl(): HTMLAnchorElement {
    return <HTMLAnchorElement> document.getElementById('basePath');
}

function getBasePath() {
    let basePathEl = getBasePathEl();
    return basePathEl ? basePathEl.href : "";
}

function getLoadingEl() {
    return <HTMLElement>document.getElementsByTagName('LOADING')[0];
}

function getContentEl() {
    return <HTMLElement>document.getElementsByTagName('CONTENT')[0];
}

function start() {
    let loadingEl = getLoadingEl();    
    utils.removeClass(loadingEl, 'show');
    utils.addClass(loadingEl, 'hide');

    let contentEl = getContentEl();
    utils.removeClass(contentEl, 'show');
    utils.addClass(contentEl, 'hide');
}

function load() {    
    let loadingEl = getLoadingEl();
    loadingEl.innerHTML = 'Loading...';
    utils.removeClass(loadingEl, 'hide');
    utils.addClass(loadingEl, 'show');
    let contentEl = getContentEl();
    utils.removeClass(contentEl, 'show');
    utils.addClass(contentEl, 'hide');
}

function loadedEvt(this: GlobalEventHandlers, ev: Event) : any {
    loaded();
    let iframe = <HTMLIFrameElement>ev.target;
    
}

function loaded() {
    let loadingEl = getLoadingEl();    
    utils.removeClass(loadingEl, 'show');
    utils.addClass(loadingEl, 'hide');
    let contentEl = getContentEl();
    utils.removeClass(contentEl, 'hide');
    utils.addClass(contentEl, 'show');
    clearTimeout(errorTimeout);
}

function loadingErrorEvt(this: GlobalEventHandlers, ev: Event) : any {
    loadingError();
}

function loadingError() {
    let loadingEl = getLoadingEl();
    loadingEl.innerHTML = 'Error loading content.';
    console.error('Error loading content.');
}

function handleClick(event: any) {

    // Don't follow the link
    event.preventDefault();

    // Log the clicked element in the console
    console.log(event.target);

    let path = utils.removeStart(event.target.href, getBasePath());
    console.log('want to navigate to:', path);
    router.navigate(path);
}

function logNavigation(event: any) {
    console.log('URL changed to %s', router.getCurrentPath());
}

function handleRoute() {
    // GET /foo/bar
    let path = router.getCurrentPath();
    console.log('URL changed to %s', path);

    const iframe = <HTMLIFrameElement>document.getElementById('mfc');
    iframe.frameBorder='0';
    iframe.scrolling='no';
    iframe.marginHeight='0';
    iframe.marginWidth='0';      
    iframe.onload = loadedEvt;
    //iframe.onerror = loadingErrorEvt;

    errorTimeout = setTimeout(loadingError, errorTimeoutValue);
    load();
    iframe.src = microFrontendsByRoute[path];

    // => URL changed to /foo/bar
}

function handlePage(): void {
    
}

function init() {
    router.add('/home', handlePage);
    router.add('/login', handlePage);
    router.add('/app1Angular8', handleRoute);
    router.add('/app2Angular9', handleRoute);
    router.add('/app3Vue', handleRoute);
    router.add('/app4React', handleRoute);
    router.run();
    // Attach handleClicks to all A elements in the navigation
    let links = document.getElementsByClassName('navLinks');
    console.log('links', links);
    Array.prototype.filter.call(links, function(ul: any){
        console.log(ul.nodeName);
        let lis = ul.getElementsByTagName('LI');
        Array.prototype.filter.call(lis, function(li: any){
            console.log(li.nodeName);
            let as = li.getElementsByTagName('A');
            Array.prototype.filter.call(as, function(a: any){
                console.log(a.nodeName);
                // Ensure to register click event lietner only once
                //router.on('navigate', handleRoute);
                a.removeEventListener("click", handleClick, false);
                a.addEventListener('click', handleClick, false);  
            });    
        });
    });

    // Attach handleClicks to Contact A element
    let ctaLinks = document.getElementsByClassName('cta');
    Array.prototype.filter.call(ctaLinks, function(cta: any){
        console.log(cta.nodeName);
        // Ensure to register click event lietner only once
        cta.removeEventListener("click", handleClick, false);
        cta.addEventListener('click', handleClick, false);  
    });    

    // Hide loading and content element
    start();
}

init();

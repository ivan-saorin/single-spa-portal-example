import './styles/style.scss';
import * as utils from './Utils';
//import GrapnelRouter from './vendor/GrapnelRouter';
import GrapnelRouter = require('./vendor/grapnel-router-min.js');

console.log('hello, world');

const testMessage: string = 'TypeScript works';

const router = new GrapnelRouter.default({ pushState : true, root : '/'   });

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

function onNavigate(event: any) {
    // GET /foo/bar
    console.log('URL changed to %s', this.path());

    const microFrontendsByRoute: any = {
        'app1Angular8': 'http://localhost:4001/',
        'app2Angular9': 'http://localhost:4002/',
        'app3Vue': 'http://localhost:4003/',
        'app4React': 'http://localhost:4004/'
      };

      const iframe = <HTMLIFrameElement>document.getElementById('mfc');
      iframe.frameBorder='0';
      iframe.scrolling='no';
      iframe.marginHeight='0';
      iframe.marginWidth='0';      
      iframe.onload = loadedEvt;
      //iframe.onerror = loadingErrorEvt;
      errorTimeout = setTimeout(loadingError, 5000);
      load();
      iframe.src = microFrontendsByRoute[this.path()];

    // => URL changed to /foo/bar
}

function init() {
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
                router.on('navigate', onNavigate);
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

/*
links.each(element => {
    document.addEventListener('click', function (event) {

        // If the clicked element doesn't have the right selector, bail
        if (!event.target.matches('.click-me')) return;
    
        // Don't follow the link
        event.preventDefault();
    
        // Log the clicked element in the console
        console.log(event.target);
    
    }, false);        
});
*/

console.log(testMessage);
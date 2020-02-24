import * as utils from './Utils';
import { RouteHandler } from './routeHandler';


function loaded() {
    let loadingEl = this.getLoadingEl();    
    utils.removeClass(loadingEl, 'show');
    utils.addClass(loadingEl, 'hide');
    let contentEl = this.getContentEl();
    utils.removeClass(contentEl, 'hide');
    utils.addClass(contentEl, 'show');
    clearTimeout(this.errorTimeout);
}

function getBasePathEl(): HTMLAnchorElement {
    return <HTMLAnchorElement> document.getElementById('basePath');
}

function getBasePath() {
    let basePathEl = getBasePathEl();
    return basePathEl ? basePathEl.href : "";
}

function handleClick(event: any) {
    
    // Don't follow the link
    event.preventDefault();

    // Log the clicked element in the console
    console.log(event.target);

    let path = utils.removeStart(event.target.href, getBasePath());
    console.log('want to navigate to:', path);
    this.router.navigate(path);
}

const microFrontendsByRoute: any = {
    '/app1Angular8': 'http://localhost:4001/',
    '/app2Angular9': 'http://localhost:4002/',
    '/app3Vue': 'http://localhost:4003/',
    '/app4React': 'http://localhost:4004/'
};

export class UIHandler {
    private errorTimeoutValue: number = 7000;
    private errorTimeout: number;
    private router: RouteHandler;
    
    constructor(private document: Document) {
        this.document = document;
    }

    public setRouter(router: RouteHandler) {
        this.router = router;
    }
    
    private getLoadingEl() {
        return <HTMLElement>document.getElementsByTagName('LOADING')[0];
    }
    
    private getContentEl() {
        return <HTMLElement>document.getElementsByTagName('CONTENT')[0];
    }
    
    private start() {
        let loadingEl = this.getLoadingEl();    
        utils.removeClass(loadingEl, 'show');
        utils.addClass(loadingEl, 'hide');
    
        let contentEl = this.getContentEl();
        utils.removeClass(contentEl, 'show');
        utils.addClass(contentEl, 'hide');
    }
    
    private load() {    
        let loadingEl = this.getLoadingEl();
        loadingEl.innerHTML = 'Loading...';
        utils.removeClass(loadingEl, 'hide');
        utils.addClass(loadingEl, 'show');
        let contentEl = this.getContentEl();
        utils.removeClass(contentEl, 'show');
        utils.addClass(contentEl, 'hide');
    }
    
    private loadedEvt(this: GlobalEventHandlers, ev: Event) : any {
        loaded();
        let iframe = <HTMLIFrameElement>ev.target;        
    }
    
    public loadingError() {
        let loadingEl = this.getLoadingEl();
        loadingEl.innerHTML = 'Error loading content.';
        console.error('Error loading content.');
    }
    
    public handleRoute() {
        // GET /foo/bar
        let path = this.router.path();
        console.log('URL changed to %s', path);
    
        const iframe = <HTMLIFrameElement>document.getElementById('mfc');
        iframe.frameBorder='0';
        iframe.scrolling='no';
        iframe.marginHeight='0';
        iframe.marginWidth='0';      
        iframe.onload = this.loadedEvt;
        //iframe.onerror = loadingErrorEvt;
    
        this.errorTimeout = setTimeout(this.loadingError, this.errorTimeoutValue);
        this.load();
        iframe.src = microFrontendsByRoute[path];
    
        // => URL changed to /foo/bar
    }
    
    public handlePage(): void {
        
    }

    public init() {
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
        this.start();
    }
    
}

export default UIHandler;
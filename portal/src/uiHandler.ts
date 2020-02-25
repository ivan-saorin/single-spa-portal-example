import * as utils from './Utils';
import { Router, RouterMode } from './router';
import { Routes } from "./routes";

export class UIHandler {
    private errorTimeoutValue: number = 7000;
    private errorTimeout: number;

    constructor(private router: Router, private document: Document, private routes: Routes) {
        this.document = document;
        this.router = router;
    }

    private microFrontendByRoute(path: string): string {
        if (this.routes[path] && this.routes[path].external.url) {
            let url = this.routes[path].external.url;
            console.log('FOUND: ', url);
            return url;
        }
        return '';
    }

    private getBasePathEl(): HTMLAnchorElement {
        return <HTMLAnchorElement> document.getElementById('basePath');
    }
    
    private getBasePath() {
        let basePathEl = this.getBasePathEl();
        return basePathEl ? basePathEl.href : "";
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
        this.hidePages("portal-page");
        let loadingEl = this.getLoadingEl();
        loadingEl.innerHTML = 'Loading...';
        utils.removeClass(loadingEl, 'hide');
        utils.addClass(loadingEl, 'show');        
    }
    
    private loaded = () => {
        let loadingEl = this.getLoadingEl();    
        utils.removeClass(loadingEl, 'show');
        utils.addClass(loadingEl, 'hide');
        let contentEl = this.getContentEl();
        utils.removeClass(contentEl, 'hide');
        utils.addClass(contentEl, 'show');
        clearTimeout(this.errorTimeout);
    }
    
    private loadedEvt = () => {
        this.loaded();
        //let iframe = <HTMLIFrameElement>ev.target;        
    }
    
    public loadingError = () => {
        let loadingEl = this.getLoadingEl();
        loadingEl.innerHTML = 'Error loading content.';
        console.error('Error loading content.');
    }
    
    public handleClick = (event: any): void => {
    
        // Don't follow the link
        event.preventDefault();
    
        // Log the clicked element in the console
        console.log(event.target);

        let href = event.target.href ? event.target.href : event.target.parentNode.href;
    
        let path = utils.removeStart(href, this.getBasePath());
        console.log(this, event);
        this.click(path);
    }

    public handleExternalPath = (): void => {
        let path = this.router ? this.router.getCurrentPath() : "";
        console.log('URL changed to external path: %s', path);
    
        const iframe = <HTMLIFrameElement>this.document.getElementById('mfc');
        iframe.frameBorder='0';
        iframe.scrolling='no';
        iframe.marginHeight='0';
        iframe.marginWidth='0';      
        iframe.onload = this.loadedEvt;
        //iframe.onerror = loadingErrorEvt;
    
        this.errorTimeout = setTimeout(this.loadingError, this.errorTimeoutValue);
        this.load();
        iframe.src = this.microFrontendByRoute(path);
    
        // => URL changed to /foo/bar
    }
    
    private showElement(name: string) {
        let element = this.document.getElementsByTagName(name.toUpperCase())[0];
        utils.removeClass(element, 'hide');
        utils.addClass(element, 'show');

    }

    private hidePages(clazz: string) {        
        let elements = this.document.getElementsByClassName(clazz);
        Array.prototype.filter.call(elements, function(element: any){
            utils.removeClass(element, 'show');
            utils.addClass(element, 'hide');
        });
        let contentEl = this.getContentEl();
        utils.removeClass(contentEl, 'show');
        utils.addClass(contentEl, 'hide');
    }

    public handleInternalPath = (): void => {
        let path = this.router ? this.router.getCurrentPath() : "";
        console.log('URL changed to internal path: %s', path);
        this.hidePages('portal-page');
        this.showElement(path.substring(1));
    }

    public handleRedirectPath = (): void => {
        let path = this.router ? this.router.getCurrentPath() : "";
        console.log('URL changed to redirect path: %s', path);
        this.router.navigate(this.microFrontendByRoute(path));
    }

    private initNavLinks(uiHandler: UIHandler) {
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
                    a.removeEventListener("click", uiHandler.handleClick, false);
                    a.addEventListener('click', uiHandler.handleClick, false);  
                });    
            });
        });
    }

    private initContact(uiHandler: UIHandler) {
        // Attach handleClicks to Contact A element
        let ctaLinks = document.getElementsByClassName('cta');
        Array.prototype.filter.call(ctaLinks, function(cta: any){
            console.log(cta.nodeName);
            // Ensure to register click event lietner only once
            cta.removeEventListener("click", uiHandler.handleClick, false);
            cta.addEventListener('click', uiHandler.handleClick, false);  
        });    
    }

    public init() {
        
        let that = this;
        this.initNavLinks(that);
        this.initContact(that);
    
        // Hide loading and content element
        this.start();
    }


    private click(this: UIHandler, path: string) {
        console.log('want to navigate to:', path);
        this.router.navigate(path);
    }
    
}

export default UIHandler;
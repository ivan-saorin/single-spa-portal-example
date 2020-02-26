import * as utils from './Utils';
import { Router, RouterMode } from './router';
import { Routes } from './routes';
import * as url from 'url';
import { PostMessage } from './postMessage';

export class UIHandler {
    private errorTimeoutValue: number = 7000;
    private errorTimeout: NodeJS.Timeout;
    private messageTimeout: NodeJS.Timeout;
    private messenger: PostMessage;

    constructor(private router: Router, private document: Document, private routes: Routes) {
        this.document = document;
        this.router = router;
        this.messenger = new PostMessage(window, this.getOrigin());
    }

    private microFrontendByRoute(path: string): string {
        if (this.routes[path] && this.routes[path].external && this.routes[path].external.url) {
            let url = this.routes[path].external.url;
            console.log('FOUND: ', url);
            return url;
        }
        if (this.routes[path] && this.routes[path].redirect && this.routes[path].redirect.url) {
            let url = this.routes[path].redirect.url;
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
    
    private getOrigin() {
        let basePath = this.getBasePath();
        let origin = basePath.substring(0, basePath.length - 1);
        console.log('origin: ', origin);
        return origin;
    }

    private getIFrameEl() {
        return <HTMLIFrameElement>document.getElementsByTagName('IFRAME')[0];
    }

    private getIFrameWindow(): Window {
        let iFrame = this.getIFrameEl();
        return iFrame.contentWindow;
    }

    private getIFrameSrc() {
        let iFrame = this.getIFrameEl();
        return iFrame.src;
    }

    private getActiveMicrofrontendUrl() {
        let src = this.getIFrameSrc();
        var p = url.parse(src);
        return p.protocol + '//' + p.host;
    }

    private getLoadingEl() {
        return <HTMLElement>document.getElementsByTagName('LOADING')[0];
    }

    private getErrorEl() {
        return <HTMLElement>document.getElementsByTagName('ERROR')[0];
    }

    private getContentEl() {
        return <HTMLElement>document.getElementsByTagName('CONTENT')[0];
    }

    private getMessageEl() {
        return <HTMLElement>document.getElementsByTagName('MESSAGE')[0];
    }

    private getAllowedPostMessageSources(): string[] {
        var allowedSources: string[] = [];
        for (const key in this.routes) {
            //console.log('key: ', key, routes[key]);
            if (this.routes[key].external) {
                allowedSources.push(this.routes[key].external.url);
            }
        }
        return allowedSources;
    }

    private start() {
        let loadingEl = this.getLoadingEl();
        utils.removeClass(loadingEl, 'show');
        utils.addClass(loadingEl, 'hide');

        let errorEl = this.getErrorEl();
        utils.removeClass(errorEl, 'show');
        utils.addClass(errorEl, 'hide');
    
        let contentEl = this.getContentEl();
        utils.removeClass(contentEl, 'show');
        utils.addClass(contentEl, 'hide');
    }
    
    private load() {    
        this.hidePages("portal-page");
        let loadingEl = this.getLoadingEl();
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
        utils.removeClass(loadingEl, 'show');
        utils.addClass(loadingEl, 'hide');
        
        let errorEl = this.getErrorEl();
        errorEl.innerHTML = 'Error loading content.';
        utils.removeClass(errorEl, 'hide');
        utils.addClass(errorEl, 'show');
        clearTimeout(this.errorTimeout);
        console.error('Error loading content.');
    }
    
    public handlePostMessageClick = (event: any): void => {
    
        // Don't follow the link
        event.preventDefault();
    
        // Log the clicked element in the console
        console.log(event.target);

        let iFrameWindow = this.getIFrameWindow();
        let activeMicrofronteEnd = this.getActiveMicrofrontendUrl();
        this.messenger.postMessage({
            "sender": this.getOrigin(),
            "recipient": activeMicrofronteEnd,
            "message": {
                "text": "Hello World!"
            }
        }, iFrameWindow, activeMicrofronteEnd);
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

    private hideElement(name: string) {
        let element = this.document.getElementsByTagName(name.toUpperCase())[0];
        utils.removeClass(element, 'show');
        utils.addClass(element, 'hide');
    }

    private hideMessage = () => {
        this.hideElement('message');
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
        let messageEl = this.getMessageEl();
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

    private initPostMessage(uiHandler: UIHandler) {
        // Attach handleClicks to Post Message A element
        let postMsgLinks = document.getElementsByClassName('postmsg');
        Array.prototype.filter.call(postMsgLinks, function(postMsg: any){
            console.log(postMsg.nodeName);
            // Ensure to register click event lietner only once
            postMsg.removeEventListener("click", uiHandler.handlePostMessageClick, false);
            postMsg.addEventListener('click', uiHandler.handlePostMessageClick, false);  
        });    
    }

    listen() {
        window.addEventListener('message', event => {
            // IMPORTANT: check the origin of the data!
            let origin = event.origin + '/';
            //console.log('origin: ', origin, 'allowedSources:', this.getAllowedPostMessageSources(), 'comparison:', (this.getAllowedPostMessageSources().indexOf(origin) > -1));
            if (this.getAllowedPostMessageSources().indexOf(origin) > -1) {
            //if (event.origin.startsWith(this.getBasePath())) { 
                // The data was sent from your site.
                // Data sent with postMessage is stored in event.data:
                console.log(event.data);
                let messageEl = this.getMessageEl();
                messageEl.innerHTML = event.data.text;
                this.showElement('message');
                this.messageTimeout = setTimeout(this.hideMessage, 4000);
            } else {
                // The data was NOT sent from your site! 
                // Be careful! Do not use it. This else branch is
                // here just for clarity, you usually shouldn't need it.
                return; 
            } 
        });
    }

    public init() {
        
        let that = this;
        this.initNavLinks(that);
        this.initContact(that);
        this.initPostMessage(that);
        this.listen();
        // Hide loading and content element
        this.start();
    }


    private click(this: UIHandler, path: string) {
        console.log('want to navigate to:', path);
        this.router.navigate(path);
    }
    
}

export default UIHandler;
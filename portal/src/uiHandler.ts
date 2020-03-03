import * as utils from './utils';
import { Router, RouterMode } from './router';
import { Routes } from './routes';
import * as url from 'url';
import { Mediator } from './mediator';

export class UIHandler {
    private errorTimeoutValue: number = 7000;
    private errorTimeout: NodeJS.Timeout;
    private messageTimeout: NodeJS.Timeout;
    private target: HTMLElement;
    private host: Mediator;

    constructor(private router: Router, private document: Document, private routes: Routes) {
        this.document = document;
        this.router = router;
        this.host = new Mediator(this);
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

        let activeMicrofronteEnd = this.getActiveMicrofrontendUrl();
        let m = "Hello World! (" + utils.makeid(6) + ")";
        this.host.sendMessage({
            "sender": this.getOrigin(),
            "recipient": activeMicrofronteEnd,
            "text": m
        });
    }

    public async postMessage(message: any) {
        if (!this.host.isConnected()) {
            let iframe = this.getIFrameEl();
            await this.host.connect(iframe);
        }
        await this.host.sendMessage(message);
    }

    public handleClick = (event: any): void => {
        if (this.target) 
            this.target.classList.remove('active');
        this.target = event.target;
    
        // Don't follow the link
        event.preventDefault();
    
        // Log the clicked element in the console
        console.log(event.target);
        //this.target.classList.add('active');

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
    
        //this.errorTimeout = setTimeout(this.loadingError, this.errorTimeoutValue);
        this.load();
        iframe.src = this.microFrontendByRoute(path);
        if (this.host.isConnected()) {
            this.host.disconnect();
        }
        if (!this.host.isConnected()) {
            let iframe = this.getIFrameEl();
            this.host.connect(iframe);
        }
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
        //utils.processElementsClass(this.document, clazz, 'show', 'hide');
        utils.processElementsClass2(this.document, clazz, 'show', 'hide');
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
        let uri = path.substring(1);
        this.showElement(uri);

        let anchor: HTMLAnchorElement = this.getAnchorForUri(uri);
        utils.processElementsClass(this.document, '.navLinks a', 'active');
        anchor.classList.add('active');
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

    getUriOfOrigin(origin: string, pathName: string) {
        if (!origin.endsWith('/')) {
            origin = origin + '/';
        }
        for (const key in this.routes) {
            console.log('key: ', key, this.routes[key]);
            if (this.routes[key].external && (origin == this.routes[key].external.url)) {
                console.log('FOUND: ', key);
                return key;
            }
        }
    }

    getAnchorForUri(uri: string, id?: string): HTMLAnchorElement {
        if (uri.startsWith('/')) {
            uri = uri.substring(1);
        }
        if (uri.endsWith('/')) {
            uri = uri.substring(0, uri.length - 1);
        }
        if (id && (id != '/') && (id != '/home')) {
            uri += id;
        }
        console.warn("Trying to find uri: ", uri);
        let a:HTMLAnchorElement = this.document.querySelector('a[href="' + uri + '"]');
        if (a) {
            return a;
        }
        uri = uri + id;
        return this.document.querySelector('a[href="' + uri + '"]');
    }

    handleTextMessage(text: string) {
        let messageEl = this.getMessageEl();
        messageEl.innerHTML = text;
        this.showElement('message');
        this.messageTimeout = setTimeout(this.hideMessage, 4000);
    }

    handleFrameLoaded(origin: string, id: string) {
        let uri = this.getUriOfOrigin(origin, id);
        let anchor: HTMLAnchorElement = this.getAnchorForUri(uri, id);
        utils.processElementsClass(this.document, '.navLinks a', 'active');
        anchor.classList.add('active');
        this.target = anchor;
    }

    listen() {
        /*
        window.addEventListener('message', event => {
            // IMPORTANT: check the origin of the data!
            let origin = event.origin + '/';
            //console.log('origin: ', origin, 'allowedSources:', this.getAllowedPostMessageSources(), 'comparison:', (this.getAllowedPostMessageSources().indexOf(origin) > -1));
            if (this.getAllowedPostMessageSources().indexOf(origin) > -1) {
            //if (event.origin.startsWith(this.getBasePath())) { 
                // The data was sent from your site.
                // Data sent with postMessage is stored in event.data:
                console.log(event.data);

                if (event.data.handshake) {
                    if (event.data.handshake == "pageLoaded") {
                        let uri = this.getUriOfOrigin(origin, event.data.pathname);                        
                        let anchor: HTMLAnchorElement = this.getAnchorForUri(uri);
                        if (this.target)
                            this.target.classList.remove('active');
                        anchor.classList.add('active');
                        this.target = anchor;
                    }
                }
                else if (event.data.notification) {
                    if (event.data.notification == "pageLoaded") {
                        let uri = this.getUriOfOrigin(origin, event.data.pathname);                        
                        let anchor: HTMLAnchorElement = this.getAnchorForUri(uri);
                        if (this.target)
                            this.target.classList.remove('active');
                        anchor.classList.add('active');
                        this.target = anchor;
                    }
                }
                else if (event.data.text) {
                    let messageEl = this.getMessageEl();
                    messageEl.innerHTML = event.data.text;
                    this.showElement('message');
                    this.messageTimeout = setTimeout(this.hideMessage, 4000);
                }
                else {
                    console.error('Unsupported message from trusted source [', origin, ']: ', event.data);
                }
            } else {
                // The data was NOT sent from your site! 
                // Be careful! Do not use it. This else branch is
                // here just for clarity, you usually shouldn't need it.
                return; 
            } 
        });
        */
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
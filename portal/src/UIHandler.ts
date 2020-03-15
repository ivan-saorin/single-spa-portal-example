import * as utils from './utils';
import { Router, RouterMode } from './Router';
import { Routes } from './Routes';
import * as url from 'url';
import { Mediator } from './Mediator';
import { ModuleHandler } from './moduleHandler';
import { JwtService } from './auth/JWTService';
import { AuthGuard } from './auth/AuthGuard';
import { Elements } from './Elements'

export class UIHandler {
    private errorTimeoutValue: number = 7000;
    private errorTimeout: NodeJS.Timeout;
    private messageTimeout: NodeJS.Timeout;
    private target: HTMLElement;
    private host: Mediator;
    private activeModule: ModuleHandler = null;
    private wereHeadingTo: string = null;
    private el: Elements;

    constructor(private router: Router, private routes: Routes, private jwt: JwtService, private guard: AuthGuard) {
        this.el = new Elements();
        this.router = router;
        this.host = new Mediator(this);
    }

    private microFrontendByRoute(path: string): string {
        if (this.routes[path] && this.routes[path].external && this.routes[path].external.url) {
            let url = this.routes[path].external.url;
            //console.log('[HOST] FOUND: ', url);
            return url;
        }
        if (this.routes[path] && this.routes[path].redirect && this.routes[path].redirect.url) {
            let url = this.routes[path].redirect.url;
            //console.log('[HOST] FOUND: ', url);
            return url;
        }
        return '';
    }

    private getAllowedRoutes(exclude?: string[]): string[] {
        if (exclude) {
            for (let i = 0; i < exclude.length; i++) {
                if (exclude[i].endsWith('/')) {
                    exclude[i] = exclude[i].substring(0, exclude[i].length - 1);
                }
            }
        }
        var routes: string[] = [];
        for (const key in this.routes) {
            //console.log('[HOST] key: ', key, routes[key]);
            if (this.routes[key].external && this.routes[key].external.url) {
                if (exclude && exclude.length > 0) {
                    let url = this.routes[key].external.url;
                    if (url.endsWith('/')) {
                        url = url.substring(0, url.length - 1);
                    }

                    if (exclude.indexOf(url) == -1) {
                        routes.push(key);
                    }
                }
                else {
                    routes.push(key);
                }
            }
        }
        return routes;
    }

    public getAllowedNavigations(): string[] {
        let url = this.getIFrameSrc();
        return this.getAllowedRoutes([url]);
    }

    private getBasePath() {
        let basePathEl = this.el.getBasePathEl();
        return basePathEl ? basePathEl.href : "";
    }

    private getOrigin() {
        let basePath = this.getBasePath();
        let origin = basePath.substring(0, basePath.length - 1);
        console.log('[HOST] origin: ', origin);
        return origin;
    }

    private getIFrameSrc() {
        let iFrame = this.el.getIFrameEl();
        return iFrame.src;
    }

    private getActiveMicrofrontendUrl() {
        let src = this.getIFrameSrc();
        var p = url.parse(src);
        return p.protocol + '//' + p.host;
    }

    private getAllowedSources(): string[] {
        var allowedSources: string[] = [];
        for (const key in this.routes) {
            //console.log('[HOST] key: ', key, routes[key]);
            if (this.routes[key].external) {
                allowedSources.push(this.routes[key].external.url);
            }
        }
        return allowedSources;
    }

    private start() {
        let loadingEl = this.el.getLoadingEl();
        utils.removeClass(loadingEl, 'show');
        utils.addClass(loadingEl, 'hide');

        let errorEl = this.el.getErrorEl();
        utils.removeClass(errorEl, 'show');
        utils.addClass(errorEl, 'hide');

        let contentEl = this.el.getContentEl();
        utils.removeClass(contentEl, 'show');
        utils.addClass(contentEl, 'hide');
    }

    private load() {
        this.hidePages("portal-page");
        let loadingEl = this.el.getLoadingEl();
        utils.removeClass(loadingEl, 'hide');
        utils.addClass(loadingEl, 'show');
    }

    private loaded = () => {
        let loadingEl = this.el.getLoadingEl();
        utils.removeClass(loadingEl, 'show');
        utils.addClass(loadingEl, 'hide');
        let contentEl = this.el.getContentEl();
        utils.removeClass(contentEl, 'hide');
        utils.addClass(contentEl, 'show');
        clearTimeout(this.errorTimeout);
    }

    public loadingError = () => {
        let loadingEl = this.el.getLoadingEl();
        utils.removeClass(loadingEl, 'show');
        utils.addClass(loadingEl, 'hide');

        let errorEl = this.el.getErrorEl();
        errorEl.innerHTML = 'Error loading content.';
        utils.removeClass(errorEl, 'hide');
        utils.addClass(errorEl, 'show');
        clearTimeout(this.errorTimeout);
        console.error('[HOST] Error loading content.');
    }

    public handlePostMessageClick = (event: any): void => {

        // Don't follow the link
        event.preventDefault();

        // Log the clicked element in the console
        console.log('[HOST] ', event.target);

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
            let iframe = this.el.getIFrameEl();
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
        console.log('[HOST] element click: ', event.target);

        let href = event.target.href ? event.target.href : event.target.parentNode.href;

        let path = utils.removeStart(href, this.getBasePath());
        this.navigate(path);
    }

    public completePreviousNavigation() {
        if (this.wereHeadingTo)
            this.router.navigate(this.wereHeadingTo);
    }

    public handleExternalPath = (): void => {
        let path = this.router ? this.router.getCurrentPath() : "";
        if (this.guard && this.guard.isProtected(path)) {
            this.wereHeadingTo = path;
            if (!this.guard.canActivate()) {
                console.log('[HOST] Denied change Location to %s path: %s', 'external', path);        
                return;
            }
        }        

        console.log('[HOST] Location changed to %s path: %s', 'external', path);        

        const iframe = <HTMLIFrameElement> document.getElementById('mfc');
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';
        iframe.marginHeight = '0';
        iframe.marginWidth = '0';
        //iframe.onerror = loadingError; // Doing this every time causes Selenium to get crazy!
        if (!iframe.onload) {
            iframe.onload = this.loaded;
        }

        this.load();
        iframe.src = this.microFrontendByRoute(path);
        if (this.host.isConnected()) {
            this.host.disconnect();
        }
        if (!this.host.isConnected()) {
            let iframe = this.el.getIFrameEl();
            this.host.connect(iframe);
        }
        // => URL changed to /foo/bar
    }

    private switchClassElement(name: string, ...classes: string[]) {
        if (!name)
            throw new Error('"name" actual parameter must be defined');
        if (!classes)
            throw new Error('"classes" actual parameter must be defined');
        if ((classes.length < 2) || (classes.length > 2))
            throw new Error('"classes" actual parameter must be an array of length 2');
        let element = document.getElementsByTagName(name.toUpperCase())[0];
        utils.removeClass(element, classes[0]);
        utils.addClass(element, classes[1]);
    }

    private showElement(name: string) {
        this.switchClassElement(name, 'hide', 'show');
    }

    private hideElement(name: string) {
        this.switchClassElement(name, 'show', 'hide');
    }

    private hideMessage = () => {
        this.hideElement('message');
    }

    private hidePages(clazz: string) {
        utils.processElementsClass2(document, clazz, 'show', 'hide');
        let contentEl = this.el.getContentEl();
        utils.removeClass(contentEl, 'show');
        utils.addClass(contentEl, 'hide');
        utils.removeClass(contentEl, 'show');
        utils.addClass(contentEl, 'hide');
    }

    public async moduleFactory(selector: string): Promise<ModuleHandler> {
        let handlerName: string;
        switch (selector) {
            case 'home':
            case 'contact':
            case 'protected': handlerName = './NoopHandler'; break;
            case 'login': handlerName = './LoginHandler'; break;

            default: throw Error(`Unknown value as selector: [${selector}].`);
        }
        console.log('[HOST] moduleFactory creating module [%s] with handler [%s]', selector, handlerName);
        let module = await import('./LoginHandler'); 
        return new module.default(this, this.router, this.routes, this.jwt);
    }

    public handleInternalPath = (): void => {
        
        let path = this.router ? this.router.getCurrentPath() : "";
        if (this.guard && this.guard.isProtected(path)) {
            this.wereHeadingTo = path;
            if (!this.guard.canActivate()) {
                console.log('[HOST] Denied change Location to %s path: %s', 'internal', path);        
                return;
            }
        }        

        if (this.activeModule) {
            this.activeModule.unmount();
        }

        console.log('[HOST] Location changed to %s path: %s', 'internal', path);

        this.hidePages('portal-page');
        let uri = path.substring(1);

        this.moduleFactory(uri).then((module: ModuleHandler) => {
            this.activeModule = module;
            if (this.activeModule) {
                this.activeModule.mount();
            }
            this.showElement(uri);
        }, 
        (reason: any) => {
            console.error('[HOST] Error loading module: ', reason);
        });

        let anchor: HTMLAnchorElement = this.getAnchorForUri(uri);
        if (anchor) {            
            utils.processElementsClass(document, '.navLinks a', 'active');
            anchor.classList.add('active');
        };
    }

    public handleRedirectPath = (): void => {
        let path = this.router ? this.router.getCurrentPath() : "";
        console.log('[HOST] URL changed to redirect path: %s', path);
        this.router.navigate(this.microFrontendByRoute(path));
    }

    private initNavLinks(uiHandler: UIHandler) {
        // Attach handleClicks to all A elements in the navigation
        let links = document.getElementsByClassName('navLinks');
        //console.log('[HOST] links', links);
        Array.prototype.filter.call(links, function (ul: any) {
            //console.log('[HOST] ', ul.nodeName);
            let lis = ul.getElementsByTagName('LI');
            Array.prototype.filter.call(lis, function (li: any) {
                //console.log('[HOST] ', li.nodeName);
                let as = li.getElementsByTagName('A');
                Array.prototype.filter.call(as, function (a: any) {
                    // Ensure to register click event lietner only once
                    a.removeEventListener("click", uiHandler.handleClick, false);
                    a.addEventListener('click', uiHandler.handleClick, false);
                });
            });
        });
    }

    private initContact(uiHandler: UIHandler) {
        // Attach handleClicks to Contact A element
        let ctaLinks = document.getElementsByClassName('cta');
        Array.prototype.filter.call(ctaLinks, function (cta: any) {
            //console.log('[HOST] ', cta.nodeName);
            // Ensure to register click event lietner only once
            cta.removeEventListener("click", uiHandler.handleClick, false);
            cta.addEventListener('click', uiHandler.handleClick, false);
        });
    }

    private initPostMessage(uiHandler: UIHandler) {
        // Attach handleClicks to Post Message A element
        let postMsgLinks = document.getElementsByClassName('postmsg');
        Array.prototype.filter.call(postMsgLinks, function (postMsg: any) {
            //console.log('[HOST] ', postMsg.nodeName);
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
            //console.log('[HOST] key: ', key, this.routes[key]);
            if (this.routes[key].external && (origin == this.routes[key].external.url)) {
                //console.log('[HOST] FOUND: ', key);
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
        let a: HTMLAnchorElement = document.querySelector('a[href="' + uri + '"]');
        if (a) {
            console.log('[HOST] activate element after page change: ', a);
            return a;
        }
        uri = uri + id;
        a = document.querySelector('a[href="' + uri + '"]');
        if (a) {
            console.log('[HOST] activate element after page change: ', a);
            return a;
        }
        return null;
    }

    handleTextMessage(text: string) {
        let messageEl = this.el.getMessageEl();
        messageEl.innerHTML = text;
        this.showElement('message');
        this.messageTimeout = setTimeout(this.hideMessage, 4000);
    }

    handleFrameLoaded(origin: string, id: string): string {
        let uri = this.getUriOfOrigin(origin, id);
        let anchor: HTMLAnchorElement = this.getAnchorForUri(uri, id);
        utils.processElementsClass(document, '.navLinks a', 'active');
        if (anchor) {
            anchor.classList.add('active');
            this.target = anchor;
        }
        if (this.guard.isProtected(uri)) {
            return this.jwt.accessToken;
        }
        else {
            return null;
        }
    }

    public init() {

        let that = this;
        this.initNavLinks(that);
        this.initContact(that);
        this.initPostMessage(that);

        console.groupCollapsed('[HOST Initial config:')
        console.groupCollapsed('[HOST Allowed Sources:')
        console.table(this.getAllowedSources());
        console.groupEnd();
        console.groupCollapsed('[HOST Allowed Routes:')
        console.table(this.getAllowedRoutes());
        console.groupEnd();
        console.groupEnd();

        // Hide loading and content element
        this.start();
    }


    public navigate(this: UIHandler, path: string) {
        console.log('[HOST] want to navigate to:', path);
        this.router.navigate(path);
    }

}

export default UIHandler;
import * as utils from './Utils';
import { Routes } from './Routes';
import { Mediator } from './Mediator';
import * as topics from './Mediator';
import { ModuleHandler } from './moduleHandler';
import { AuthGuard } from './auth/AuthGuard';
import { Elements } from './Elements'

export class UIHandler {
    private errorTimeoutValue: number = 7000;
    private errorTimeout: NodeJS.Timeout;
    private messageTimeout: NodeJS.Timeout;
    private target: HTMLElement;
    private activeModule: ModuleHandler = null;
    private wereHeadingTo: string = null;
    private el: Elements;

    constructor(private mediator: Mediator, private routes: Routes, /*private jwt: JwtService, */private guard: AuthGuard) {
        this.el = new Elements(routes);

        this.initSubscribers();
	}

	initSubscribers() {
		this.mediator.handle(topics.COMMAND_FRAME_LOADED, async (message: any) => {
            console.assert((message), 'message MUST be defined');            
            console.assert((message.origin), 'message MUST contains the field "origin"');
            console.assert((message.id), 'message MUST contains the field "id"');
            console.log(`${topics.COMMAND_FRAME_LOADED} id [${message.$id}]`, message);
                        
            let accessToken = await this.handleFrameLoaded(message.origin, message.id);
            return {
                allowedNavigations: this.el.getAllowedNavigations(),
                accessToken: accessToken
            };
        });

		this.mediator.handle(topics.COMMAND_TEXT_MESSAGE, async (message: any) => {
            console.assert((message), 'message MUST be defined');            
            console.assert((message.text), 'message MUST contains the field "text"');
            console.log(`${topics.COMMAND_TEXT_MESSAGE} id [${message.$id}]`, message);
                        
            this.handleTextMessage(message.text);
            return {};
        });

        this.mediator.handle(topics.COMMAND_COMPLETE_PREV_NAVIGATION, async (message: any) => {
            console.assert((message), 'message MUST be defined');            
            console.log(`${topics.COMMAND_COMPLETE_PREV_NAVIGATION} id [${message.$id}]`, message);
                        
            this.completePreviousNavigation();
            return {};
        });
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
        this.el.hideLoading();
        this.el.hideError();
        this.el.hideContent();
    }

    private load() {
        this.el.hidePages("portal-page");
        this.el.showLoading();
    }

    private loaded = () => {
        this.el.hideLoading();
        this.el.showContent();
        clearTimeout(this.errorTimeout);
    }

    public loadingError = () => {
        this.el.hideLoading();
        let errorEl = this.el.getErrorEl();
        errorEl.innerHTML = 'Error loading content.';
        this.el.showError();
        clearTimeout(this.errorTimeout);
        console.error('[HOST] Error loading content.');
    }

    public handlePostMessageClick = async (event: any) => {

        // Don't follow the link
        event.preventDefault();

        // Log the clicked element in the console
        console.log('[HOST] ', event.target);

        let activeMicrofronteEnd = this.el.getActiveMicrofrontendUrl();
        let m = "Hello World! (" + utils.makeid(6) + ")";

        try {
            await this.mediator.request(topics.COMMAND_SEND_MESSAGE, {
                "sender": this.el.getOrigin(),
                "recipient": activeMicrofronteEnd,
                "text": m
            });
        } catch(error) {
            console.error(error);
        }
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

        let path = utils.removeStart(href, this.el.getBasePath());
        this.navigate(path);
    }

    public async completePreviousNavigation() {
        await this.navigate(this.wereHeadingTo);
    }

    private async path() {
        let path;
        try {
            path = await this.mediator.request(topics.COMMAND_CURRENT_PATH, {});
        } catch(error) {
            console.error(error);
            path = "";
        }
        return path;
    }

    public handleExternalPath = async () => {
        let path = await this.path();
        if (this.guard && this.guard.isProtected(path.currentPath)) {
            this.wereHeadingTo = path.currentPath;
            if (! await this.guard.canActivate()) {
                console.log('[HOST] Denied change Location to %s path: %s', 'external', path.currentPath);        
                return;
            }
        }        

        console.log('[HOST] Location changed to %s path: %s', 'external', path.currentPath);        

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
        iframe.src = this.microFrontendByRoute(path.currentPath);

        try {
            let response1 = await this.mediator.request(topics.COMMAND_IS_CONNECTED_TO_GUEST, {});
            if (response1.isConnected) {
                let iframe = this.el.getIFrameEl();
                await this.mediator.request(topics.COMMAND_DISCONNECT_FROM_GUEST, {});
            }

            let response2 = await this.mediator.request(topics.COMMAND_IS_CONNECTED_TO_GUEST, {});
            if (!response2.isConnected) {
                await this.mediator.request(topics.COMMAND_CONNECT_TO_GUEST, {iframe: this.el.getIFrameEl()});
            }
        } catch(error) {
            console.error(error);
        }
    }

    private hideMessage = () => {
        this.el.hideElement('message');
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
        return new module.default(this.mediator, this.routes);
    }

    public handleInternalPath = async () => {
        let path = await this.path();
        if (this.guard && this.guard.isProtected(path.currentPath)) {
            this.wereHeadingTo = path.currentPath;
            if (! await this.guard.canActivate()) {
                console.log('[HOST] Denied change Location to %s path: %s', 'internal', path.currentPath);        
                return;
            }
        }        

        if (this.activeModule) {
            this.activeModule.unmount();
        }

        console.log('[HOST] Location changed to %s path: %s', 'internal', path.currentPath);

        this.el.hidePages('portal-page');
        let uri = path.currentPath.substring(1);

        this.moduleFactory(uri).then((module: ModuleHandler) => {
            this.activeModule = module;
            if (this.activeModule) {
                this.activeModule.mount();
            }
            this.el.showElement(uri);
        }, 
        (reason: any) => {
            console.error('[HOST] Error loading module: ', reason);
        });

        let anchor: HTMLAnchorElement = this.getAnchorForUri(uri);
        if (anchor) {            
            utils.processElementsClass(document, '.navLinks a', 'active');
            anchor.classList.add('active');
        }
    }

    public handleRedirectPath = async ()=> {
        let path = await this.path();
        console.log('[HOST] URL changed to redirect path: %s', path.currentPath);
        this.navigate(this.microFrontendByRoute(path.currentPath));
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
        this.el.showElement('message');
        this.messageTimeout = setTimeout(this.hideMessage, 4000);
    }

    async handleFrameLoaded(origin: string, id: string): Promise<string> {
        let uri = this.getUriOfOrigin(origin, id);
        let anchor: HTMLAnchorElement = this.getAnchorForUri(uri, id);
        utils.processElementsClass(document, '.navLinks a', 'active');
        if (anchor) {
            anchor.classList.add('active');
            this.target = anchor;
        }
        try {
            if (this.guard.isProtected(uri)) {
                let response = await this.mediator.request(topics.COMMAND_ACCESS_TOKEN, {});                
                return response.accessToken;
            }
            else {
                return null;
            }
        } catch(error) {
            console.error(error);
            return null;
        }
    }

    public init() {

        this.initNavLinks(this);
        this.initContact(this);
        this.initPostMessage(this);

        console.groupCollapsed('[HOST] Initial config:')
        console.groupCollapsed('[HOST] Allowed Sources:')
        console.table(this.getAllowedSources());
        console.groupEnd();
        console.groupCollapsed('[HOST] Allowed Routes:')
        console.table(this.el.getAllowedRoutes());
        console.groupEnd();
        console.groupEnd();

        // Hide loading and content element
        this.start();
    }


    public async navigate(this: UIHandler, path: string) {
        console.log('[HOST] want to navigate to:', path);
        if (path) {
            try {
                await this.mediator.request(topics.COMMAND_NAVIGATE, {url: path});
            } catch(error) {
                console.error(error);
            }    
        }
    }

}

export default UIHandler;
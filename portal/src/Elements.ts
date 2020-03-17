import * as url from 'url';
import { Routes } from './Routes';
import * as utils from './Utils';

export const show: string[] = ['hide', 'show'];
export const hide: string[] = ['show', 'hide'];

export class Elements {
    constructor(private routes: Routes) {}

    public getBasePathEl(): HTMLAnchorElement {
        return <HTMLAnchorElement>document.getElementById('basePath');
    }

    public getIFrameEl() {
        return <HTMLIFrameElement>document.getElementsByTagName('IFRAME')[0];
    }

    public getLoadingEl() {
        return <HTMLElement>document.getElementsByTagName('LOADING')[0];
    }

    public getErrorEl() {
        return <HTMLElement>document.getElementsByTagName('ERROR')[0];
    }

    public getContentEl() {
        return <HTMLElement>document.getElementsByTagName('CONTENT')[0];
    }

    public getMessageEl() {
        return <HTMLElement>document.getElementsByTagName('MESSAGE')[0];
    }

    public getAllowedNavigations(): string[] {
        let url = this.getIFrameSrc();
        return this.getAllowedRoutes([url]);
    }

    public getBasePath() {
        let basePathEl = this.getBasePathEl();
        return basePathEl ? basePathEl.href : "";
    }

    public getOrigin() {
        let basePath = this.getBasePath();
        let origin = basePath.substring(0, basePath.length - 1);
        console.log('[HOST] origin: ', origin);
        return origin;
    }

    public getIFrameSrc() {
        let iFrame = this.getIFrameEl();
        return iFrame.src;
    }

    public getActiveMicrofrontendUrl() {
        let src = this.getIFrameSrc();
        var p = url.parse(src);
        return p.protocol + '//' + p.host;
    }

    public getAllowedRoutes(exclude?: string[]): string[] {
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

    public visibility(el: HTMLElement, args: string[]) {
        console.assert((args.length == 2), 'args parameter MUST have a length equals to 2.');
        utils.removeClass(el, args[0]);
        utils.addClass(el, args[1]);
    }

    public hideLoading() {
        this.visibility(this.getLoadingEl() , hide);
    }

    public showLoading() {
        this.visibility(this.getLoadingEl() , show);
    }

    public hideError() {
        this.visibility(this.getErrorEl() , hide);
    }

    public showError() {
        this.visibility(this.getErrorEl() , show);
    }

    public hideContent() {
        this.visibility(this.getContentEl() , hide);
    }

    public showContent() {
        this.visibility(this.getContentEl() , show);
    }

    public hidePages(clazz: string) {
        utils.processElementsClass2(document, clazz, 'show', 'hide');
        this.hideContent();
    }

    private switchClassElement(name: string, args: string[]) {
        let element = document.getElementsByTagName(name.toUpperCase())[0] as HTMLElement;
        this.visibility(element, args);
    }

    public showElement(name: string) {
        this.switchClassElement(name, show);
    }

    public hideElement(name: string) {
        this.switchClassElement(name, hide);
    }

}
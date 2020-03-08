
export class Elements {
    constructor() {}

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

}
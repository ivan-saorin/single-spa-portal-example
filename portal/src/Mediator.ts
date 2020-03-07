import { host }  from "./rimless";
import UIHandler from "./UIHandler";

interface IFrameLoaded {
    allowedNavigations: string[],
    payload: any
}

export class Mediator {
    private connection: any = null;
    private payload: any = {};
    constructor(private uiHandler: UIHandler) {

    }

    public async connect(iframe: HTMLIFrameElement) {
        this.connection = await host.connect(iframe, {
            log: (...values: any[]) => console.log('[HOST]', ...values),
            frameLoaded: (sender: string, notification: string, origin: string, id: string): IFrameLoaded => {
                this.uiHandler.handleFrameLoaded(sender, id);
                return {
                    allowedNavigations: this.uiHandler.getAllowedNavigations(),
                    payload: this.payload
                };
            },
            navigate: (url: string, payload?: any) => {
                this.payload = payload || {};
                this.uiHandler.navigate(url);
            },
            textMessage: (sender: string, notification: string, text: string) => this.handleTextMessage(sender, notification, text)
        });
    }

    public handleTextMessage(sender: string, notification: string, text: string) {
        console.log(`[HOST] [${text}]`);
        this.uiHandler.handleTextMessage(text);
    }

    public async disconnect() {
        this.connection.close();
        this.connection = null;
    }

    public isConnected(): boolean {
        return this.connection != null;
    }

    public async sendMessage(message: any) {
        // call remote procedures on host
        console.log('[HOST] calling HOST.textMessage');
        if (this.connection) {
            const res = await this.connection.remote.textMessage(message).catch((err: any) => { console.error(err); });
        }
        else {
            console.warn('sendMessage is only available for external pages.');
            //console.log('[HOST]', res);   // hello there
        }        
    }
}
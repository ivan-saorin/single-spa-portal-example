import { host }  from "./rimless";
import UIHandler from "./uiHandler";

export class Mediator {
    private connection: any = null;
    constructor(private uiHandler: UIHandler) {

    }

    public async connect(iframe: HTMLIFrameElement) {
        this.connection = await host.connect(iframe, {
            log: (...values: any[]) => console.log('[HOST]', ...values),
            frameLoaded: (sender: string, notification: string, origin: string, id: string) => this.uiHandler.handleFrameLoaded(sender, id),
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
        const res = await this.connection.remote.textMessage(message).catch((err: any) => { console.error(err); });
        //console.log('[HOST]', res);   // hello there
    }
}
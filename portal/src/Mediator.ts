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
            frameLoaded2: (sender: string, notification: string, id: string) => console.log(`[HOST] ${notification} [${id}] from [${sender}]`)
        });
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
        console.log('[HOST] calling HOST.log');
        const res = await this.connection.remote.log("Log from host").catch((err: any) => { console.error(err); });
        //console.log('[HOST]', res);   // hello there
    }
}
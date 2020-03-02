import guest from "../rimless/guest";

export class Mediator {
    private connection: any = null;

    constructor() {

    }

    public async connect() {
        this.connection = await guest.connect({
            log: (...values: any[]) => console.log('[GUEST]', values)
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
        console.log('[GUEST] calling HOST.log');
          const res = await this.connection.remote.log(message).catch((err: any) => { console.error(err); });
          //console.log('[GUEST]', res);   
    }

    public async frameLoaded(origin: string, id: string) {
        // call remote procedures on host
        console.log(`[GUEST] calling HOST.frameLoaded [${origin}] [${id}]`);
          const res = await this.connection.remote.frameLoaded(window.origin, 'frameLoaded', origin, id).catch((err: any) => { console.error(err); });
          //console.log('[GUEST]', res);   
    }
}
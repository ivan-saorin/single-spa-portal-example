import guest from "./rimless/guest";

export class Mediator {
  private connection: any = null;

  constructor() {

  }

  public async connect() {
      this.connection = await guest.connect({
          log: (...values: any[]) => console.log('[GUEST]', ...values),
          textMessage: (message: any) => this.handleTextMessage(message)
      })
  }

  public handleTextMessage(message: any) {
    console.log('[GUEST]', message);
    this.textMessage(`Echoing message from host: ${message.text}`);
  }

  public async disconnect() {
      this.connection.close();
      this.connection = null;
  }

  public isConnected(): boolean {
      return this.connection != null;
  }

  public async textMessage(message: string) {
      // call remote procedures on host
      console.log('[GUEST] calling HOST.textMessage');
      const res = await this.connection.remote.textMessage(window.origin, 'text', message).catch((err: any) => { console.error(err); });
      //console.log('[GUEST]', res);   
  }

  public async frameLoaded(origin: string, id: string) {
      // call remote procedures on host
      console.log(`[GUEST] calling HOST.frameLoaded [${origin}] [${id}]`);
        const res = await this.connection.remote.frameLoaded(window.origin, 'frameLoaded', origin, id).catch((err: any) => { console.error(err); });
        //console.log('[GUEST]', res);   
  }
}

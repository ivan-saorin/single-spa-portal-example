import guest from "./rimless/guest";

interface IFrameLoaded {
    allowedNavigations: string[],
    payload: any
}
  
export class Mediator {
  private connection: any = null;

  constructor(private vueApp: any) {

  }

  public async connect() {
      this.connection = await guest.connect({
          log: (...values: any[]) => console.log('[GUEST]', ...values),
          textMessage: (message: any) => this.handleTextMessage(message)
      })
  }

  public handleTextMessage(message: any) {
    console.log('[GUEST]', message);
    this.vueApp.msg = message.text;
    this.vueApp.messagePresent = true;
    setTimeout(() => this.vueApp.messagePresent = false, 4000);
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
      await this.connection.remote.textMessage(window.origin, 'text', message).catch((err: any) => { console.error(err); });
      //const res = await this.connection.remote.textMessage(window.origin, 'text', message).catch((err: any) => { console.error(err); });
      //console.log('[GUEST]', res);   
  }

  public async frameLoaded(origin: string, id: string) {
      // call remote procedures on host
      console.log(`[GUEST] calling HOST.frameLoaded [${origin}] [${id}]`);
      const res = await this.connection.remote.frameLoaded(window.origin, 'frameLoaded', origin, id).catch((err: any) => { console.error(err); });
      //console.log('[GUEST]', res);   
      let response = <IFrameLoaded> res;
      this.vueApp.navs = response.allowedNavigations;
      console.log('[GUEST] allowed navigations', response.allowedNavigations);
      console.log('[GUEST] received payload', response.payload);
  }

  public async navigate(url: string, payload: any) {
    if (payload.origin) {
      payload._origin = window.origin;
    }
    else {
      payload.origin = window.origin;
    }
    await this.connection.remote.navigate(url, payload).catch((err: any) => { console.error(err); });
    //const res = await this.connection.remote.navigate(url, payload).catch((err: any) => { console.error(err); });
  }

}

import guest from "./rimless/guest";

export interface IFrameLoaded {
  allowedNavigations: string[],
  accessToken?: string,
  payload: any
}

export class Mediator {
  private connection: any = null;

  constructor(private home: any) {

  }

  public async connect() {
      this.connection = await guest.connect({
          log: (...values: any[]) => console.log('[GUEST]', ...values),
          textMessage: (message: any) => this.handleTextMessage(message)
      })
  }

  public handleTextMessage(message: any) {
    console.log('[GUEST]', message);
    this.home.setState({ message: message.text, messagePresent: true });
    setTimeout(() => this.home.setState({ messagePresent: false }), 4000);
    this.textMessage(`Echoing message from host: ${message.text}`);
  }

  public async disconnect() {
    if (this.isConnected()) {
      this.connection.close();
      this.connection = null;
    }
  }

  public isConnected(): boolean {
      return this.connection != null;
  }

  public async textMessage(message: string) {
      // call remote procedures on host
      console.log('[GUEST] calling HOST.textMessage');      
      //const res = await this.connection.remote.textMessage(window.origin, 'text', message).catch((err: any) => { console.error(err); });
      //console.log('[GUEST]', res);   
      await this.connection.remote.textMessage(window.origin, 'text', message).catch((err: any) => { console.error(err); });
  }

  public async frameLoaded(origin: string, id: string): Promise<IFrameLoaded> {
      // call remote procedures on host
      console.log(`[GUEST] calling HOST.frameLoaded [${origin}] [${id}]`);
      const res = await this.connection.remote.frameLoaded(window.origin, 'frameLoaded', origin, id).catch((err: any) => { console.error(err); });
      //console.log('[GUEST]', res);
      let response = res as IFrameLoaded;
      this.home.setState( {navs: response.allowedNavigations} );
      console.log('[GUEST] allowed navigations', response.allowedNavigations);
      console.log('[GUEST] accessToken', response.accessToken);
      console.log('[GUEST] received payload', response.payload);
      return res;
  }

  public async navigate(url: string, payload: any) {
    if (payload.origin) {
      payload._origin = window.origin;
    }
    else {
      payload.origin = window.origin;
    }
    //const res = await this.connection.remote.navigate(url, payload).catch((err: any) => { console.error(err); });
    await this.connection.remote.navigate(url, payload).catch((err: any) => { console.error(err); });
  }

}

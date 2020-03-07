import guest from "./rimless/guest";
import { Injectable, EventEmitter } from '@angular/core';
import { JwtService } from './jwt.service';

interface IFrameLoaded {
  allowedNavigations: string[],
  accessToken?: string,
  payload: any
}

@Injectable({
  providedIn: 'root'
})
export class MediatorService {
  private connection: any = null;
  private receive: EventEmitter<any>;
  private allowedNavs: EventEmitter<any>;
  private refresh: EventEmitter<any>;

  constructor(private jwt: JwtService) {

  }

  setRefresh(refresh: EventEmitter<any>) {
    this.refresh = refresh;
  }

  setReceiver(receiver: EventEmitter<any>) {
    this.receive = receiver;
  }

  setAllowedNavs(allowedNavs: EventEmitter<any>) {
    this.allowedNavs = allowedNavs;
  }

  public async connect() {
      this.connection = await guest.connect({
          log: (...values: any[]) => console.log('[GUEST]', ...values),
          textMessage: (message: any) => this.handleTextMessage(message)
      })
  }

  public handleTextMessage(message: any) {
    console.log('[GUEST]', message);
    this.receive.emit(message);
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
      if (res) {
        let response = <IFrameLoaded> res;
        this.allowedNavs.emit(response.allowedNavigations);
        if (response.accessToken) {
          this.jwt.accessToken = response.accessToken;
          this.refresh.emit({});
        }
        console.log('[GUEST] allowed navigations', response.allowedNavigations);
        console.log('[GUEST] accessToken', response.accessToken);
        console.log('[GUEST] received payload', response.payload);
      }
  }

  public async navigate(url: string, payload: any) {
    if (payload.origin) {
      payload._origin = window.origin;
    }
    else {
      payload.origin = window.origin;
    }
    const res = await this.connection.remote.navigate(url, payload).catch((err: any) => { console.error(err); });
  }
}

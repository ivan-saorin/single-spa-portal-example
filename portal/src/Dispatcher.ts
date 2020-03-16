import { host }  from "./rimless";
import { Mediator } from "./Mediator";
import * as t from './Topics';


interface IFrameLoaded {
    allowedNavigations: string[],
    accessToken?: string,
    payload: any
}

export class Dispatcher {
    private connection: any = null;
    private payload: any = {};
    private accessToken: Promise<string>;
    private allowedNavigations: Promise<string[]>;
    constructor(private mediator: Mediator) {
        this.initSubscribers();
    }

    initSubscribers() {

        this.mediator.subscribe(t.REQUEST_ACCESS_TOKEN_TOPIC, (context: any, message: any) => {
            console.warn('[HOST] received message %s', t.REQUEST_ACCESS_TOKEN_TOPIC, context, message);
        })

        this.mediator.subscribe(t.REQUEST_ALLOWED_NAVIGATIONS_TOPIC, (context: any, message: any) => {
            console.warn('[HOST] received message %s', t.REQUEST_ALLOWED_NAVIGATIONS_TOPIC, context, message);
        })

    }

    public async connect(iframe: HTMLIFrameElement) {
        this.connection = await host.connect(iframe, {
            log: (...values: any[]) => console.log('[HOST]', ...values),
            frameLoaded: (sender: string, notification: string, origin: string, id: string): IFrameLoaded => {
                this.mediator.publish(t.REQUEST_ACCESS_TOKEN_TOPIC, [sender, id]).then((message: any) => {
                    console.warn('[HOST] %s received', t.REQUEST_ACCESS_TOKEN_TOPIC, message);
                }, (rejected: any) => {
                    console.error('[HOST] %s rejected', t.REQUEST_ACCESS_TOKEN_TOPIC, rejected);
                });

                this.mediator.publish(t.REQUEST_ALLOWED_NAVIGATIONS_TOPIC, {}).then((message: any) => {
                    console.warn('[HOST] %s received', t.REQUEST_ACCESS_TOKEN_TOPIC, message);
                }, (rejected: any) => {
                    console.error('[HOST] %s rejected', t.REQUEST_ALLOWED_NAVIGATIONS_TOPIC, rejected);
                });
                
                return {                    
                    allowedNavigations: [],
                    payload: ''
                };

                
                //let accessToken = this.uiHandler.handleFrameLoaded(sender, id);
                /*
                if (accessToken) 
                    return {                    
                        allowedNavigations: this.uiHandler.getAllowedNavigations(),
                        accessToken: accessToken,
                        payload: this.payload
                    };                
                else
                    return {                    
                        allowedNavigations: this.uiHandler.getAllowedNavigations(),
                        payload: this.payload
                    };
                */
            },
            navigate: (url: string, payload?: any) => {
                this.payload = payload || {};
                //this.uiHandler.navigate(url);
            },
            textMessage: (sender: string, notification: string, text: string) => this.handleTextMessage(sender, notification, text)
        });
    }

    public handleTextMessage(sender: string, notification: string, text: string) {
        console.log(`[HOST] [${text}]`);
        //this.uiHandler.handleTextMessage(text);
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
            //const res = await this.connection.remote.textMessage(message).catch((err: any) => { console.error('[HOST] ', err); });
            await this.connection.remote.textMessage(message).catch((err: any) => { console.error('[HOST] ', err); });
        }
        else {
            console.warn('[HOST] sendMessage is only available for external pages.');
            //console.log('[HOST]', res);   // hello there
        }        
    }
}
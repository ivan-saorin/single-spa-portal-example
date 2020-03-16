import { host }  from "./rimless";
import { Mediator } from "./Mediator";
import * as topics from './Mediator';


interface IFrameLoaded {
    allowedNavigations: string[],
    accessToken?: string,
    payload: any
}

export class GuestsHandler {
    private connection: any = null;
    private payload: any = {};
    private accessToken: Promise<string>;
    private allowedNavigations: Promise<string[]>;
    constructor(private mediator: Mediator) {
		this.initSubscribers();
	}

	initSubscribers() {
		this.mediator.handle(topics.COMMAND_SEND_MESSAGE, async (message: any) => {
			console.assert((message), 'message MUST be defined');
            console.assert((message.sender), 'message MUST contains the field "sender"');
            console.assert((message.recipient), 'message MUST contains the field "recipient"');
            console.assert((message.text), 'message MUST contains the field "text"');
			console.log(`${topics.COMMAND_SEND_MESSAGE} id [${message.$id}] message[${message}]`);
			await this.sendMessage(message);
            return {};
        });
        
		this.mediator.handle(topics.COMMAND_IS_CONNECTED_TO_GUEST, async (message: any) => {
			console.log(`${topics.COMMAND_IS_CONNECTED_TO_GUEST} id [${message.$id}] message[${message}]`);
			return {isConnected: await this.isConnected()};
        });

		this.mediator.handle(topics.COMMAND_CONNECT_TO_GUEST, async (message: any) => {
			console.assert((message), 'message MUST be defined');
            console.assert((message.iframe), 'message MUST contains the field "iframe"');
			console.log(`${topics.COMMAND_IS_CONNECTED_TO_GUEST} id [${message.$id}] message[${message}]`);
			await this.connect(message.iframe);
            return {};
        });

		this.mediator.handle(topics.COMMAND_DISCONNECT_FROM_GUEST, async (message: any) => {
            console.log(`${topics.COMMAND_DISCONNECT_FROM_GUEST} id [${message.$id}]`);
            this.disconnect();
			return {};
        });
	}

    public async connect(iframe: HTMLIFrameElement) {
        this.connection = await host.connect(iframe, {
            log: (...values: any[]) => 
                console.log('[HOST]', ...values),

            frameLoaded: (sender: string, notification: string, origin: string, id: string): Promise<IFrameLoaded> => 
                this.handleFrameLoaded(sender, notification, origin, id),

            navigate: (url: string, payload?: any) => 
                this.handleNavigate(url, payload),

            textMessage: (sender: string, notification: string, text: string) => 
                this.handleTextMessage(sender, notification, text)
        });
    }

    public async handleTextMessage(sender: string, notification: string, text: string) {
        console.log(`[HOST] [${text}]`);
        try {
            await this.mediator.request(topics.COMMAND_TEXT_MESSAGE, {sender, notification, text});
        } catch(error) {
            console.error(error);
        }
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

    private async handleFrameLoaded (sender: string, notification: string, origin: string, id: string): Promise<IFrameLoaded> {
        try {
            let response = await this.mediator.request(topics.COMMAND_FRAME_LOADED, {origin, id});
            if (response.accessToken) 
                return {                    
                    allowedNavigations: response.allowedNavigations,
                    accessToken: response.accessToken,
                    payload: this.payload
                };                
            else
                return {                    
                    allowedNavigations: response.allowedNavigations,
                    payload: this.payload
                };

        } catch(error) {
            console.error(error);
            return {                    
                allowedNavigations: [],
                payload: ''
            };    
        }        
    }

    private async handleNavigate(url: string, payload?: any){
        this.payload = payload || {};
        try {
            await this.mediator.request(topics.COMMAND_NAVIGATE, {url: url});
        } catch(error) {
            console.error(error);
        }
    }
}
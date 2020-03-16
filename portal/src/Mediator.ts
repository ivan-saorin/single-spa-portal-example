/*!
 * based on code in: https://github.com/mehdishojaei/mediator
*/

import * as utils from './Utils';

//const one = new Promise<string>((resolve, reject) => {});

export class Mediator {
    
    private mediator: Object = {};
    private cache: any = {};
    
    constructor() {}
    
    private isArray(obj: Object) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    
    prepareResponse(message: any, response: any) {
        response.$request = message;
        return response;
    }

    async request(topic: string, message: any, context?: any): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let id = utils.makeid(8);
            let rsvpChannelId = utils.makeid(5);
            let responseChannel = `response.${topic}-${rsvpChannelId}`;
            message.$rsvpChannel = responseChannel;
            message.$id = id;
            let result;
            console.groupCollapsed(`[HOST] request to ${message.$id}`);

            let callback = (context: any, message: any) => {
                console.log(`[HOST] response to ${message.$request.$id} using ${message.$request.$rsvpChannel}`, message);
                result = message;
            }

            this.subscribe(responseChannel, callback);
            try {
                await this.publish(`request.${topic}`, message);
                console.log(`[HOST] response to request.${topic} received`);
                console.groupEnd();                
                resolve(result);
            } catch (error) {
                console.error(`[HOST] response to request.${topic} not received`);            
                console.groupEnd();
                reject(new Error(`[HOST] response to request.${topic} not received`));
            } finally {
                this.unsubscribe(responseChannel, callback);
            }
        });
        return promise;
    }
    

    // Returns a promise of all the promises returned from subscribers callbacks.
    // If a promise fails, the result promise will not be reject and continue waiting
    // for other promises.
    // The result promise will be resolve if the return promises of all the
    // subscribers resolves, and reject otherwise.
    public publish(channel: string, hash: any): any {
        let that: any = this;
        let promises: number = 0;
        let finishedPromises: number = 0;
        let faileds: number = 0;
        let subscribers = this.cache[channel];

        let promise = new Promise<any>((resolve, reject) => {

            if (subscribers) {
                function checkFinished() {
                    ++finishedPromises;
        
                    // Continue on failure
                    if (finishedPromises == promises) {
                      if (faileds) {
                        reject();
                      } else {
                        resolve();
                      }
                    }        
                }
        
                function  callbackFail() {
                    ++faileds;
                    checkFinished();
                }
    
                for (var i = 0, len = subscribers.length; i < len; i++) {
                    let subscriber = subscribers[i];
                    if (!hash['$channel']) {
                        hash['$channel'] = channel;
                    } 
                    let result = subscriber.callback(subscriber.context || that, hash);
        
                    if (!result) {
                        ++promises;
                        break;
                    }
        
                    if (result && typeof result.then === 'function') {
                        ++promises;
                        resolve(result.then(checkFinished, callbackFail));
                    }
                }
                resolve();
            }
            else {
                reject();
            }
    
            if (!promises) {
              resolve();
            }        
        });
        return promise;
    }

    subscribe (channels: any, callback: any, context?: any) {
        channels = this.isArray(channels) ? channels : (<string>channels.split(/\s+/) || []);


        for (var i = 0, len = channels.length; i < len; i++) {
            var channel = channels[i];

            if (!this.cache[channel]) {
                this.cache[channel] = [];
            }

            this.cache[channel].push({ callback: callback, context: context });            
        }
    };

    unsubscribe(channels: any, callback: any) {
        let i, k, channel, subscribers, newSubscribers;
        channels = this.isArray(channels) ? channels : (channels.split(/\s+/) || []);

        let channelsLength = channels.length;
        for (i = 0; i < channelsLength; i++) {
            channel = channels[i];

            if (!callback) {
                delete this.cache[channel];
                return;
            }

            subscribers = this.cache[channel];

            if (!subscribers) {
                throw 'Channel "' + channel + '" was not subscribed previously!';
            }

            newSubscribers = [];

            let subscribersLength = subscribers.length
            for (k = 0; k < subscribersLength; k++) {
                if (subscribers[k].callback !== callback) {
                    newSubscribers.push(subscribers[k]);
                }
            }

            if (newSubscribers.length > 0) {
                this.cache[channel] = newSubscribers;
            } else {
                delete this.cache[channel];
            }
        }
    };
}

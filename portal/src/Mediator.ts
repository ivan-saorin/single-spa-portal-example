/*!
 * based on code in: https://github.com/mehdishojaei/mediator
*/

//const one = new Promise<string>((resolve, reject) => {});

export class Mediator {

    private mediator: Object = {};
    private cache: any = {};

    constructor() {}

    private isArray(obj: Object) {
        return Object.prototype.toString.call(obj) === '[object Array]';
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
                };
    
                for (var i = 0, len = subscribers.length; i < len; i++) {
                    let subscriber = subscribers[i];
                    if (!hash['channel']) {
                        hash['channel'] = channel;
                    } else {
                        hash['_channel'] = channel;
                    }
                    let result = subscriber.callback(subscriber.context || that, hash);
        
                    //if (result == false) {
                    if (!result) {
                        //break;
                        //resolve(++promises);
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
        let i, k, channelsLength, subscribersLength, channel, subscribers, newSubscribers;
        channels = this.isArray(channels) ? channels : (channels.split(/\s+/) || []);

        for (i = 0, channelsLength = channels.length; i < channelsLength; i++) {
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

            for (k = 0, subscribersLength = subscribers.length; k < subscribersLength; k++) {
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

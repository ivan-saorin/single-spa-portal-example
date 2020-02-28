export class PostMessage {

    constructor(private window: Window, private origin: string) {
        this.window = window;
        this.origin = origin;
    }

    postMessage(message: any, window?: Window, origin?: string): any {
        let w = window ? window : this.window;
        let o = origin ? origin : this.origin;
        console.warn("Posting Message ", message, o);
        w.postMessage(message, o);
    }

}

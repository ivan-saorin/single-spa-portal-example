import { host }  from "./rimless";

export class RimLessHost {

    constructor(private iframe: HTMLIFrameElement) {

    }

    public async sendMessage() {
        const connection = await host.connect(this.iframe, {
            myVariable: 12,
            myFunction: (value: any) => `hello ${value}`,
        });

        // access variables on the iframe
        console.log(connection.remote.myIframeVariable);  // 42

        // call remote procedures on the iframe
        const result = await connection.remote.myIframeFunction("here");
        console.log(result);  // hello here   

        // close the connection
        connection.close();
    }
}
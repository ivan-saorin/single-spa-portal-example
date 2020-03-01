import { Component, AfterViewInit } from '@angular/core';
import { PostMessage } from './postMessage/postMessage';
import { guest }  from "./rimless";

@Component({
  selector: 'flight-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  private messenger: PostMessage;
  
  ngAfterViewInit() {
      console.log('ngAfterViewInit: ');

      if (!this.messenger) {
          //this.messenger = new PostMessage(window.parent, window.parent.origin);
          this.messenger = new PostMessage(window.parent, 'http://localhost:8080');
      }

      //let href = window.location.href;
      let pathname = window.location.pathname;

      this.messenger.postMessage({
          "sender": window.origin,
          "notification": "pageLoaded",
          "pathname": pathname
      });

      this.connect();
  }

  async connect() {
    const connection = await guest.connect({
      myIframeVariable: 42,
      myIframeFunction: (value) => `hello ${value}`,
    });
    
    // access variables on the host
    console.log(connection.remote.myVariable); // 12
    
    // call remote procedures on host
    const res = await connection.remote.myFunction("there");
    console.log(res);   // hello there
    
    // close the connection
    connection.close();
  }

}


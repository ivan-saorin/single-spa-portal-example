import { Component, HostListener} from '@angular/core';
import { Mediator } from './mediator';

@Component({
  selector: 'host-message',
  template: '<p *ngIf="hostMessagePresent">{{hostMessage}}</p>',
  styleUrls: ['./host.message.component.css']
})
export class HostMessageComponent {
  hostMessagePresent: boolean = false;
  hostMessage: string = '';
  mediator: Mediator;

  

  /*
  @HostListener('window:message',['$event'])
  onMessage(e) {
      console.log('message: ', e);
      if (e.data.message) {
        this.serverMessagePresent = true;
        let msg = e.data.message;
        this.serverMessage = 
        'Message arrived from [' + e.origin + ']: ' + msg.text;
        
        setTimeout(() => this.serverMessagePresent = false, 4000);

        if (!this.messenger) {
            this.messenger = new PostMessage(window.parent, e.origin);
        }

        this.messenger.postMessage({
            "sender": e.data.recipient,
            "text": "Echoing.... " + msg.text
        });

        //if (e.origin!="http://localhost:4200") {
        //  return false;
        //}
      }
  }
  */
}


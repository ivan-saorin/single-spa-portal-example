import { Component, HostListener} from '@angular/core';
import { PostMessage } from './postMessage';

@Component({
  selector: 'post-message',
  template: '<p *ngIf="serverMessagePresent">{{serverMessage}}</p>',
  styleUrls: ['./post.message.component.css']
})
export class PostMessageComponent {
  serverMessagePresent: boolean = false;
  serverMessage: string = "Hello!";
  messenger: PostMessage;
  
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
}

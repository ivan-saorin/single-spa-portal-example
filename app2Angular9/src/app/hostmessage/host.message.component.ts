import { Component, AfterViewInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { MediatorService } from '../mediator.service';

@Component({
  selector: 'host-message',
  template: '<p *ngIf="hostMessagePresent">{{hostMessage}}</p>',
  styleUrls: ['./host.message.component.css']
})
export class HostMessageComponent implements AfterViewInit, OnDestroy {
  hostMessagePresent: boolean = false;
  hostMessage: string = '';

  @Input() receive = new EventEmitter<any>();

  constructor(private mediator: MediatorService) {
    mediator.setReceiver(this.receive);
  }
  
  ngAfterViewInit() {
    this.receive.subscribe((event) => {
      console.log(event);
      this.hostMessage = `[${event.sender}] ${event.text}`;
      this.hostMessagePresent=true;    
      setTimeout(() => this.hostMessagePresent=false, 4000);  
    });
  }

  ngOnDestroy() {

  }

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


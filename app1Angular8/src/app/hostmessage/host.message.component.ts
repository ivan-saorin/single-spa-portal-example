import { Component, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MediatorService } from '../mediator.service';

@Component({
  selector: 'host-message',
  template: '<p *ngIf="hostMessagePresent" (receive)="onReceive($event)">{{hostMessage}}</p>',
  styleUrls: ['./host.message.component.css']
})
export class HostMessageComponent implements AfterViewInit, OnDestroy {
  hostMessagePresent: boolean = false;
  hostMessage: string = '';

  @Output() receive = new EventEmitter<any>();

  constructor(private mediator: MediatorService) {
    mediator.setReceiver(this.receive);
  }
  
  onReceive(event) {
    this.hostMessage = event;
    this.hostMessagePresent=true;    
    setTimeout(() => this.hostMessagePresent=false, 4000);
  }

  ngAfterViewInit() {

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


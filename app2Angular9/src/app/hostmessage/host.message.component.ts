import { Component, AfterViewInit, OnDestroy, Input, EventEmitter } from '@angular/core';
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
}


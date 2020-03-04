import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MediatorService } from './mediator.service';

@Component({
  selector: 'product-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  constructor(private mediator: MediatorService) {
    
  }
  
  async ngAfterViewInit() {
      console.log('ngAfterViewInit');
      //if (!this.mediator) {
      //  this.mediator = new Mediator();
      //}

      if (this.mediator.isConnected()) {
        await this.mediator.disconnect();
      }

      if (!this.mediator.isConnected()) {
        await this.mediator.connect();
      }
      //let href = window.location.href;
      let pathname = window.location.pathname;
      console.log('window.location: ', window.location.href);
      await this.mediator.frameLoaded(window.origin, pathname);
  }

  ngOnDestroy() {
    this.mediator.disconnect();
  }

}


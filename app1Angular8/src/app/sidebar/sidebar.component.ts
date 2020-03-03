import { Component, AfterViewInit, Input, EventEmitter } from '@angular/core';
import { MediatorService } from '../mediator.service';


@Component({
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements AfterViewInit {
  navs: string[];
  @Input() allowedNavs = new EventEmitter<any>();

  constructor(private mediator: MediatorService) {
    mediator.setAllowedNavs(this.allowedNavs);
  }

  ngAfterViewInit() {
    this.allowedNavs.subscribe((event) => {
      console.log(event);
      this.navs = event;
    });
  }

  navigate(url: string) {
    console.log('want to navigate to: ', url);
    this.mediator.navigate(url, {sample: 'payload'});
  }
}

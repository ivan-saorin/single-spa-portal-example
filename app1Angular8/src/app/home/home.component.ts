import { Component, Input, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../jwt.service';
import { MediatorService } from '../mediator.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  needsLogin: boolean = false;
  @Input() refresh = new EventEmitter<any>();

  constructor(
    private mediator: MediatorService,
    private router: Router,
    private jwtService: JwtService) {
      mediator.setRefresh(this.refresh);
  }


  ngOnInit() {
    console.log('ngOnInit');
    this.needsLogin = !this.jwtService.isAuthenticated();
    console.log('needsLogin', this.needsLogin);
    this.refresh.subscribe((event) => {
      console.log(event);
      this.needsLogin = !this.jwtService.isAuthenticated();
      let dto = this.jwtService.decode();
      console.log('token dto: ', dto);  
    });
  }

  login(): void {
    this.needsLogin = !this.jwtService.isAuthenticated();
    if (this.needsLogin) {
      this.router.navigateByUrl('/login');
    }
  }

  logout(): void {
    this.needsLogin = !this.jwtService.isAuthenticated();
    if (!this.needsLogin) {
      this.jwtService.logout();    
      this.login();
    }
  }


}

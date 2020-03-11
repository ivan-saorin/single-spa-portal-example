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
  subject: string = '';

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
      if ((dto.iss == 'example.com/portal') && (dto.aud.indexOf('app1Angular8') > -1)) {
        let roles: string = '';
        dto.groups.forEach((group) => roles += group + ', ');
        if (roles.length > 0) {
          roles = roles.substring(0, roles.length - 2);
        }
        this.subject = `${dto.sub} as [${roles}]`;

      }
      /*
      iss: "example.com/portal"
      sub: "guest"
      aud: (3) ["app1Angular8", "app2Angular9", "app4React"]
      exp: 1583919013
      nbf: 1583915403
      iat: 1583915413
      jti: "sQJMoEv3tY"
      groups: ["guest"]      
      */
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

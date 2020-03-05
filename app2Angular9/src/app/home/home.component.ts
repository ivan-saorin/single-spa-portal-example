import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { JwtService } from '../jwt.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  needsLogin: boolean = false;

  constructor(
    private router: Router,
    private jwtService: JwtService) {
  }


  ngOnInit() {
    console.log('ngOnInit');
    this.needsLogin = !this.jwtService.isAuthenticated();
    console.log('needsLogin', this.needsLogin);
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

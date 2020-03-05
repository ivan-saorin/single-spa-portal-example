import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from  '@angular/forms';
//import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms'
import {Router, ActivatedRoute} from '@angular/router';
import { User } from './models';
import { JwtService } from '../jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted  =  false;

  constructor(private jwtService: JwtService, private router: Router, private formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      user: new FormControl('user', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      password: new FormControl('password', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    });
    this.loginForm.setValue({ 'user': '', 'password': '' });
  }

  get user(): any { return this.loginForm.get('user'); }
  get password(): any { return this.loginForm.get('password'); }

  get formControls() { 
    return this.loginForm.controls; 
  }

  login(): void {
    console.log(this.loginForm.value);
    this.isSubmitted = true;
    if(this.loginForm.invalid){
      console.error(this.user.errors);
      console.error(this.password.errors);
      return;
    }
    this.jwtService.login(this.loginForm.value);
    this.router.navigateByUrl('/admin');
  }

  logout(): void {
    
  }

}

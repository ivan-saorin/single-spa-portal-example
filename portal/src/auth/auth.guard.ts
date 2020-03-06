import { JwtService } from './jwt.service';
import { Router, CanActivate } from '../router';


export class AuthGuard implements CanActivate {
  constructor(public auth: JwtService, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate('/login');
      return false;
    }
    return true;
  }

}
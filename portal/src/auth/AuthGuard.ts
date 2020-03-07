import { JwtService } from './JWTService';
import { Router, CanActivate } from '../Router';


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
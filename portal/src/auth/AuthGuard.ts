import { JwtService } from './JWTService';
import { Router, CanActivate } from '../Router';
import { Routes } from '../Routes';


export class AuthGuard implements CanActivate {
  constructor(public auth: JwtService, public router: Router, private routes: Routes) {}

  isProtected(path: string): boolean {
    if (!path.startsWith('/')) 
      path = '/' + path;

    let b: boolean = (this.routes[path] && this.routes[path].external && this.routes[path].external.guarded);
    b = b || (this.routes[path] && this.routes[path].internal && this.routes[path].internal.guarded);
    return b;
  }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate('/login');
      return false;
    }
    return true;
  }

}
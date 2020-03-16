import { JwtService } from './JWTService';
import { Router, CanActivate } from '../Router';
import { Routes } from '../Routes';
import { Dispatcher } from '../Dispatcher';


export class AuthGuard implements CanActivate {
  constructor(private dispatcher: Dispatcher, public auth: JwtService, public router: Router, private routes: Routes) {}

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
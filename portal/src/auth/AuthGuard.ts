import { JwtService } from './JWTService';
import { Router, CanActivate } from '../Router';
import { Routes } from '../Routes';
import { Mediator } from '../Mediator';
import * as topics from '../Mediator';


export class AuthGuard implements CanActivate {
  constructor(private mediator: Mediator, public auth: JwtService, private routes: Routes) {}

  isProtected(path: string): boolean {
    if (!path.startsWith('/')) 
      path = '/' + path;

    let b: boolean = (this.routes[path] && this.routes[path].external && this.routes[path].external.guarded);
    b = b || (this.routes[path] && this.routes[path].internal && this.routes[path].internal.guarded);
    return b;
  }

  async canActivate(): Promise<boolean> {
    if (!this.auth.isAuthenticated()) {
      await this.navigate('/login');
      return false;
    }
    return true;
  }

  async navigate(path: string) {
    try {
        await this.mediator.request(topics.COMMAND_NAVIGATE, {url: path});
    } catch(error) {
        console.error(error);
    }
  }

  async path(): Promise<any> {
      try {
          return await this.mediator.request(topics.COMMAND_CURRENT_PATH, {});
      } catch(error) {
          console.error(error);
      }
  }
}
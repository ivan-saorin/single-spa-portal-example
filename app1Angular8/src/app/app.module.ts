import { ProductModule } from './product/product.module';
import { HttpClientModule } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MediatorService } from './mediator.service';
import { AppComponent } from './app.component';
import { APP_EXTRA_OPTIONS, APP_ROUTES } from './app.routes';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HostMessageComponent } from './hostmessage/host.message.component';
import { JwtService } from './jwt.service';
import { AuthGuardService } from './auth.guard.service';
import { JwtModule } from "@auth0/angular-jwt";

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ProductModule,    
    RouterModule.forRoot([...APP_ROUTES], {...APP_EXTRA_OPTIONS}),
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
          return localStorage.getItem('access_token');
        },
        whitelistedDomains: ["localhost:3200"],
        blacklistedRoutes: ["localhost:3200/auth/login"],
        skipWhenExpired: true
      }
    })
  ],
  declarations: [
    AppComponent,
    HostMessageComponent,
    SidebarComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent
  ],
  providers: [
    MediatorService, 
    AuthGuardService, 
    JwtService, 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

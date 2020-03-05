import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { 
  AuthGuardService as AuthGuard 
} from '../auth.guard.service';

export const FLIGHT_ROUTES: Routes = [
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'products/:id',
    component: ProductEditComponent,
    canActivate: [AuthGuard]
  }
];

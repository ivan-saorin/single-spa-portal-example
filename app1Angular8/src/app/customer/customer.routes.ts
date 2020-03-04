import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';

export const FLIGHT_ROUTES: Routes = [
  {
    path: 'customers',
    component: CustomerListComponent
  },
  {
    path: 'customers/:id',
    component: CustomerEditComponent
  }
];

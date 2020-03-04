import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerService } from './customer.service';
import { FLIGHT_ROUTES } from './customer.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(FLIGHT_ROUTES)
  ],
  declarations: [
    CustomerListComponent,
    CustomerEditComponent
  ],
  providers: [CustomerService],
  exports: []
})
export class CustomerModule { }

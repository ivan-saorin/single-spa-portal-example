import { Component, OnInit } from '@angular/core';
import { ProductFilter } from '../product-filter';
import { ProductService } from '../product.service';
import { Product } from '../product';

@Component({
  selector: 'app-product',
  templateUrl: 'product-list.component.html'
})
export class ProductListComponent implements OnInit {

  filter = new ProductFilter();
  selectedProduct: Product;
  feedback: any = {};

  get productList(): Product[] {
    return this.productService.productList;
  }

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.search();
  }

  search(): void {
    this.productService.load(this.filter);
  }

  select(selected: Product): void {
    this.selectedProduct = selected;
  }

  delete(product: Product): void {
    if (confirm('Are you sure?')) {
      this.productService.delete(product).subscribe(() => {
          this.feedback = {type: 'success', message: 'Delete was successful!'};
          setTimeout(() => {
            this.search();
          }, 1000);
        },
        err => {
          this.feedback = {type: 'warning', message: 'Error deleting.'};
        }
      );
    }
  }
}

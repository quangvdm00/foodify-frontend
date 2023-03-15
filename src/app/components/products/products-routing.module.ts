import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './physical/category/category.component';
import { SubCategoryComponent } from './physical/sub-category/sub-category.component';
import { ProductListComponent } from './physical/product-list/product-list.component';
import { AddProductComponent } from './physical/add-product/add-product.component';
import { DigitalCategoryComponent } from './digital/digital-category/digital-category.component';
import { DigitalSubCategoryComponent } from './digital/digital-sub-category/digital-sub-category.component';
import { DigitalListComponent } from './digital/digital-list/digital-list.component';
import { DigitalAddComponent } from './digital/digital-add/digital-add.component';
import { ProductDetailComponent } from './physical/product-detail/product-detail.component';
import {AddProductCategoryComponent} from "./physical/add-product-category/add-product-category.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'category',
        component: CategoryComponent,
        data: {
          title: "Category",
          breadcrumb: "Category"
        }
      },
      // {
      //   path: 'physical/sub-category',
      //   component: SubCategoryComponent,
      //   data: {
      //     title: "Sub Category",
      //     breadcrumb: "Sub Category"
      //   }
      // },
      {
        path: 'product-list',
        component: ProductListComponent,
        data: {
          title: "Product List",
          breadcrumb: "Product List"
        }
      },
      {
        path: 'product-detail',
        component: ProductDetailComponent,
        data: {
          title: "Product Detail",
          breadcrumb: "Product Detail"
        }
      },
      {
        path: 'add-product',
        component: AddProductComponent,
        data: {
          title: "Add Products",
          breadcrumb: "Add Product"
        }
      },
      {
        path: 'add-product-category',
        component: AddProductCategoryComponent,
        data: {
          title: "Add Products Category",
          breadcrumb: "Add Product Category"
        }
      },
      // {
      //   path: 'digital/digital-category',
      //   component: DigitalCategoryComponent,
      //   data: {
      //     title: "Category",
      //     breadcrumb: "Category"
      //   }
      // },
      // {
      //   path: 'digital/digital-sub-category',
      //   component: DigitalSubCategoryComponent,
      //   data: {
      //     title: "Sub Category",
      //     breadcrumb: "Sub Category"
      //   }
      // },
      // {
      //   path: 'digital/digital-product-list',
      //   component: DigitalListComponent,
      //   data: {
      //     title: "Product List",
      //     breadcrumb: "Product List"
      //   }
      // },
      // {
      //   path: 'digital/digital-add-product',
      //   component: DigitalAddComponent,
      //   data: {
      //     title: "Add Products",
      //     breadcrumb: "Add Product"
      //   }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }

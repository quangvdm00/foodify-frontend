import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TableService } from 'src/app/shared/service/table.service';
import { CategoryService } from 'src/app/shared/service/category.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers: [TableService, DecimalPipe],
})


export class CategoryComponent implements OnInit {
    categories = [];

    constructor(private categoryService: CategoryService) {

    }

    ngOnInit(): void {
        this.listCategories();
    }

    listCategories() {
        this.categoryService.getCategories().subscribe(
            data => {
                this.categories = data;
            }
        )
    }
}

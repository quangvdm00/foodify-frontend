import { Component, OnInit, TemplateRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TableService } from 'src/app/shared/service/table.service';
import { CategoryService } from 'src/app/shared/service/category.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers: [TableService, DecimalPipe],
})


export class CategoryComponent implements OnInit {
    categories = [];
    categoryId: number;

    constructor(private categoryService: CategoryService,
        private modalService: BsModalService) {

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

    //Modal
    modalRef: BsModalRef;

    openModal(template: TemplateRef<any>, id: number) {
        this.categoryId = id;
        console.log("before deleted");
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
        console.log("after deleted");
    }

    confirm(categoryId: number): void {
        console.log("Delete category with id :" + categoryId);
        this.modalRef.hide();
    }

    decline(): void {
        this.modalRef.hide();
    }
}

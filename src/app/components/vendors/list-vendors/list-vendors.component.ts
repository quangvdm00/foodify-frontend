import {AfterViewInit, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {vendorsDB} from '../../../shared/tables/vendor-list';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";

@Component({
    selector: 'app-list-vendors',
    templateUrl: './list-vendors.component.html',
    styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent implements OnInit {
    public vendors = [];
    modalRef: BsModalRef;
    isEditable = {};
    vendorForm: FormGroup;

    show: boolean = false;
    fullName: string;

    vendor: vendorsDB;
    edittedVendorId: number;
    @ViewChild('vendor', {static: true}) vendorRef: ElementRef;

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder) {

        this.vendors = this.loadData();
    }

    showModal() {
        this.show = !this.show;
    }


    fnAddSuccessFully() {

        const vendor = new vendorsDB(
            'assets/images/team/3.jpg',
            this.vendor.name,
            this.vendor.products,
            this.vendor.store_name,
            new Date(this.vendor.date),
            BigInt(10000),
            BigInt(100000));
        // console.log(this.vendorRef.nativeElement.value);

        alert(this.fullName);
    }

    // thePageNumber: number = 1;
    // thePageSize: number = 5;
    // theTotalElements: number = 2-;



    public settings = {
        actions: {
            position: 'right'
        },
        columns: {
            vendor: {
                title: 'Vendor',
                type: 'html',
            },
            products: {
                title: 'Products'
            },
            store_name: {
                title: 'Store Name'
            },
            date: {
                title: 'Date'
            },
            balance: {
                title: 'Wallet Balance',
            },
            revenue: {
                title: 'Revenue',
            }
        },
    };

    createVendorDetailsForm() {
        this.vendorForm = this.formBuilder.group({
            vendor: [''],
            products: [''],
            storeName: [''],
            date: ['']
        });
    }

    // onSubmitEditProductDetail(editVendorDetail: NgForm) {
    //     console.log(editVendorDetail.form.get('storeName'));
    // }

    loadData() {
        return vendorsDB.data;
    }

    ngOnInit() {
        this.createVendorDetailsForm();
    }

    save(row, rowIndex) {
        this.isEditable[rowIndex] = !this.isEditable[rowIndex];
        console.log('Row saved: ' + rowIndex);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

    confirm(vendorIdx: number): void {
        this.vendors.splice(vendorIdx, 1);
        this.modalRef.hide();
    }

    decline(): void {
        this.modalRef.hide();
    }

    onEditProduct(item: vendorsDB, template: TemplateRef<any>) {
        // this.createVendorDetailsForm();

        this.vendor = item;
        this.edittedVendorId = this.vendors.findIndex(t => t.name === item.name);
        console.log(this.edittedVendorId);

        this.vendorForm.patchValue({
            vendor: this.vendor.name,
            products: this.vendor.products,
            storeName: this.vendor.store_name,
            date: this.vendor.date
        });
        this.modalRef = this.modalService.show(template, {class: 'modal-md'});

        this.show = !this.show;

        // console.log(this.vendorForm.getRawValue());

    }

    onSubmitEditProduct() {
        // updated vendor
        const updateVendor = this.vendors[this.edittedVendorId];
        updateVendor.name = this.getVendorName;
        updateVendor.products = this.getProducts;
        updateVendor.store_name = this.getStoreName;
        updateVendor.date = this.getDate;

        this.modalRef.hide();
    }

    onClose() {
        this.modalRef.hide();
    }

    get form() {
        return this.vendorForm.controls;
    }

    get getVendorName() {
        return this.vendorForm.get('vendor').getRawValue();
    }

    get getProducts() {
        return this.vendorForm.get('products').getRawValue();
    }

    get getStoreName() {
        return this.vendorForm.get('storeName').getRawValue();
    }

    get getDate() {
        return this.vendorForm.get('date').getRawValue();
    }
}

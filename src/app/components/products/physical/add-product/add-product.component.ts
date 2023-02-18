import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ChangeEvent} from "@ckeditor/ckeditor5-angular";


@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
    public productForm: UntypedFormGroup;
    public Editor = ClassicEditor;
    public counter: number = 1;
    public url = [{
        img: "assets/images/user.png",
    },
        {
            img: "assets/images/user.png",
        },
        {
            img: "assets/images/user.png",
        },
        {
            img: "assets/images/user.png",
        },
        {
            img: "assets/images/user.png",
        }
    ];


    @ViewChild('productQuantity') quantity;
    @ViewChild('ckEditor', {static: false}) ckEditor;
    description: string = '';

    constructor(private fb: UntypedFormBuilder) {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            price: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            category: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            code: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            quantity: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            // size: ['', Validators.required]
        });
    }

    onAddNewProduct() {
        console.log(this.productName);
        console.log(this.productCategory);
        console.log(this.productPrice);
        console.log(this.quantity.nativeElement.value);
        console.log(this.description);
    }

    onChange({editor}: ChangeEvent) {
        let data = editor.getData();
        data = data.replace(/\r?\n|\r/gm, ' '); // remove line breaks
        data = data.replace(/\s\s+/g, ' ').trim(); // remove line breaks
        // const data = EDITTORC.instances.Editor.document.getBody().getText();
        this.description = data;
    }

    get productName() {
        return this.productForm.get('name').value;
    }

    get productCategory() {
        return this.productForm.get('category').value;
    }

    get productPrice() {
        return this.productForm.get('price').value;
    }

    get productQuantity() {
        return this.productForm.get('quantity').value;
    }

    // get productName() {
    //     return this.productForm.get('name').value;
    // }

    increment() {
        this.counter += 1;
    }

    decrement() {
        this.counter -= 1;
    }

    // FileUpload
    readUrl(event: any, i) {
        if (event.target.files.length === 0) {
            return;
        }
        // Image upload validation
        var mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }
        // Image upload
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.url[i].img = reader.result.toString();
        };
    }

    ngOnInit() {
    }

}

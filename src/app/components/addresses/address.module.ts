import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressRoutingModule } from './addresses-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListAddressComponent } from './list-address/list-address.component';

@NgModule({
    declarations: [ListAddressComponent],
    imports: [
        CommonModule,
        AddressRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule
    ]
})
export class AddressModule { }

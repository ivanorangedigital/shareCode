import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckoutRoutingModule } from "./checkout-routing.module";
import { CheckoutComponent } from "./checkout.component";
import { SharedCheckoutModule } from "./shared/shared.module";

@NgModule({
    declarations: [
        CheckoutComponent
    ],
    imports: [
        CheckoutRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedCheckoutModule
    ]
})

export class CheckoutModule { }
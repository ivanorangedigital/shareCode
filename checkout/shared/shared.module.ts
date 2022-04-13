import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BillingComponent } from "../components/billing/billing.component";
import { CardComponent } from "../components/card/card.component";
import { CheckoutProductComponent } from "../components/product/product.component";
import { ShippingComponent } from "../components/shipping/shipping.component";
import { TabsPaymentComponent } from "../components/tabs-payment/tabs-payment.component";

@NgModule({
    declarations: [
        CardComponent,
        TabsPaymentComponent,
        ShippingComponent,
        BillingComponent,
        CheckoutProductComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [
        CardComponent,
        TabsPaymentComponent,
        ShippingComponent,
        BillingComponent,
        CheckoutProductComponent
    ]
})

export class SharedCheckoutModule { }
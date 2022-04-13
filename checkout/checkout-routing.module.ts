import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CartGuard } from "../guards/cart.guard";
import { CheckoutComponent } from "./checkout.component";
import { CheckoutResolveService } from "./resolve/resolve.service";

const routes: Routes = [
    {
        path: '', component: CheckoutComponent, resolve: {data: CheckoutResolveService}, canActivate: [CartGuard]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class CheckoutRoutingModule { }
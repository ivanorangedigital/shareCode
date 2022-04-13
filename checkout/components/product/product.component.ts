import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-checkout-product',
    templateUrl: './product.component.html'
})

export class CheckoutProductComponent {
    @Input() products: any

    constructor() { }

}
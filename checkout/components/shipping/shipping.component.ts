import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html'
})

export class ShippingComponent {
    @Input() shippingForm: FormGroup | any;
    @Input() shipping: any;

    constructor() { }

}
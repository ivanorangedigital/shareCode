import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html'
})

export class BillingComponent {
    @Input() billingForm: FormGroup | any;
    @Input() shipping: any;

    constructor() { }

}
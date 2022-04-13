import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-tabs-payment',
    templateUrl: './tabs-payment.component.html'
})

export class TabsPaymentComponent {
    @Input() dataForm: FormGroup | any;

    paymentType: any[];

    constructor() {
        this.paymentType = [
            {
                id: 'card',
                name: 'Carta di credito'
            },
            /*{
                id: 'paypal',
                name: 'PayPal'
            },
            {
                id: 'cod',
                name: 'Contrassegno'
            }*/
        ]
    }

}
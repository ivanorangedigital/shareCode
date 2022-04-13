import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../components/loader/loader.service';
import { PaymentService } from '../services/payment.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html'
})

export class CheckoutComponent implements OnInit {
    user: any;
    shipping: any;
    products: any[] = [];

    total: number = 0;

    shippingSameBilling: boolean = false;

    dataForm: FormGroup;

    constructor(private fb: FormBuilder, private paymentService: PaymentService, private route: ActivatedRoute, private loader: LoaderService) {
        this.dataForm = this.fb.group({
            type: ['card', Validators.required],
            card: this.fb.group({
                number: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
                exp_month: ['01', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
                exp_year: ['2022', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
                cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
            }),
            billing: this.fb.group({
                address_1: ['', Validators.required],
                address_2: [''],
                city: ['', Validators.required],
                company: [''],
                country: ['1', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                phone: ['', Validators.required],
                postcode: ['', Validators.required],
                state: ['', Validators.required]
            }),
            shipping: this.fb.group({
                address_1: ['', Validators.required],
                address_2: [''],
                city: ['', Validators.required],
                company: [''],
                country: ['1', Validators.required],
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                phone: ['', Validators.required],
                postcode: ['', Validators.required],
                state: ['', Validators.required]
            })
        });
    }

    ngOnInit() {
        this.route.data.subscribe((res: any) => {
            console.log(res);
            this.shipping = res.data.shipping_zones.body.filter((res: any) => res.id !== 0);
            this.products = res.data.cart.body;
            this.total = this.products.reduce((i: any, j: any) => i + j.price * j.amount, 5);
            if (res.data.user != null) {
                this.user = res.data.user.body;
                this.dataForm.controls['billing'].setValue(this.user.billing);
                this.dataForm.controls['shipping'].setValue(this.user.shipping);
            }
        });
    }

    toggleShippingSameBilling() {
        this.shippingSameBilling = !this.shippingSameBilling;
    }

    getShippingLocations(type: string): string {
        const method = this.shipping.find((res: any) => res.id == this.dataForm.controls[type].value.country);
        return method.name.substring(0, 2);
    }

    startOrder() {
        this.loader.loader = true;
        const cardToken = this.dataForm.controls['card'].value;
        const billing = this.dataForm.controls['billing'].value;
        let shipping = this.dataForm.controls['shipping'].value;
        const products = this.products.map(res => {
            return {
                product_id: res.id,
                quantity: res.amount
            }
        });

        if (this.dataForm.valid || !this.shippingSameBilling && this.dataForm.controls['billing'].valid) {
            this.paymentService.createCardToken(cardToken).subscribe(res => {
                console.log('card token ', res);
                if (!this.shippingSameBilling) {
                    const newShipping = {
                        address_1: billing.address_1,
                        address_2: billing.address_2,
                        city: billing.city,
                        company: billing.company,
                        country: billing.country,
                        first_name: billing.first_name,
                        last_name: billing.last_name,
                        phone: billing.phone,
                        postcode: billing.postcode,
                        state: billing.state
                    }
                    shipping = newShipping;
                }
                const data = {
                    amount: (this.total * 100).toFixed(0),
                    currency: 'EUR',
                    return_url: 'https://tabacchisalerno.it',
                    receipt_email: billing.email,
                    automatic_payment_methods: {
                        enabled: true
                    },
                    confirm: true,
                    customer: undefined,
                    metadata: {
                        items: JSON.stringify(products)
                    },
                    shipping: {
                        address: {
                            city: shipping.city,
                            country: this.getShippingLocations('shipping'),
                            line1: shipping.address_1,
                            line2: shipping.address_2,
                            postal_code: shipping.postcode,
                            state: shipping.state
                        },
                        carrier: undefined,
                        name: shipping.first_name + ' ' + shipping.last_name,
                        phone: shipping.phone,
                        tracking_number: undefined
                    },
                    payment_method_data: {
                        type: 'card',
                        card: {
                            token: res.id
                        },
                        billing_details: {
                            name: billing.first_name + ' ' + billing.last_name,
                            phone: billing.phone,
                            address: {
                                city: billing.city,
                                country: this.getShippingLocations('billing'),
                                line1: billing.address_1,
                                line2: billing.address_2,
                                postal_code: billing.postcode,
                                state: billing.state
                            },
                            email: billing.email
                        }
                    }
                }
                this.paymentService.startPayment(data).subscribe(res => {
                    console.log('payment intent ', res);
                    billing.country = this.getShippingLocations('billing');
                    shipping.country = this.getShippingLocations('shipping');
                    this.paymentService.createOrder({
                        payment_method: 'card',
                        payment_method_title: 'pagamento con carta',
                        set_paid: true,
                        shipping: shipping,
                        billing: billing,
                        line_items: products,
                        // temp
                        shipping_lines: [
                            {
                                method_id: 'mps',
                                total: '5',
                                method_title: 'spedizione mail boxes'
                            }
                        ]
                    }).subscribe(res => {
                        console.log(res);
                        
                        alert('pagamento compleato');
                        this.loader.loader = false;
                    });
                }, () => {
                    alert('check backend system');
                    this.loader.loader = false;
                });
            }, () => {
                alert('controlla i dati della carta');
                this.loader.loader = false;
            });
        } else {
            alert('controlla i dati inseriti');
            this.loader.loader = false;
        }
    }
}

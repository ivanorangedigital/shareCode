import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html'
})

export class CardComponent {
    exp_month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    exp_year = ['2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033'];
    @Input() cardForm: FormGroup | any;

    constructor() { }
}
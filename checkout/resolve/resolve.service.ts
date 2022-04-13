import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { forkJoin, map, Observable, of } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { CartService } from "src/app/services/cart.service";
import { ShopService } from "src/app/services/shop.service";

@Injectable({
    providedIn: 'root'
})

export class CheckoutResolveService implements Resolve<Observable<any>> {

    constructor(private authService: AuthService, private shopService: ShopService, private cartService: CartService) { }
    resolve(): Observable<any> {
        let id = this.authService.getTokenPayLoad();
        if (id) id = id.data.user.id;

        let ob1;
        if (id) ob1 = this.authService.getUserData(id);
        else ob1 = of(null);

        const ob2 = this.authService.getShippingZones();

        const cart: any[] = this.cartService.cart;
        const ob3 = this.shopService.getAllProducts('?include=' + cart.map(res => res.id).toString() + '&per_page=100').pipe(
            map(res => {
                for (let i = 0; i < res.body.length; i++) {
                    const p = cart.find(p => p.id === res.body[i].id);
                    res.body[i].amount = p.amount;
                }
                return res;
            })
        );
        return forkJoin([
            ob1, ob2, ob3
        ]).pipe(map(res => {
            return {
                user: res[0],
                shipping_zones: res[1],
                cart: res[2]
            }
        }))
    }
}
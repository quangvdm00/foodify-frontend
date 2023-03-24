import { Shop } from "./Shop";
import { User } from "./User";

export class Shipper {
    //Dto
    id: number;
    isActive: boolean;
    isShipping: false;
    userId: number;
    shopId: number;

    //responses
    user: User;
    shop: Shop;
}

import { Shop } from "../service/Shop";
import { Category } from "./Category";

export class Product {

    id: number;
    name: string;
    description: string;
    isEnabled: boolean;
    discountPercent: number;
    cost: number;
    averageRating: number;
    reviewCount: number;
    images: string[];

    categoryNames: string[];
    categories: Category[];

    shopId: number;
    shop: Shop;
}

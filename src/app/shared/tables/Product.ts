import { Shop } from "../service/Shop";

export class Product {

    id: number;
    name: string;
    description: string;
    isEnabled: boolean;
    discountPercent: number;
    cost: bigint;
    averageRating: number;
    reviewCount: number;
    shopId: number;
    images: string[];
    categories: string[];

}

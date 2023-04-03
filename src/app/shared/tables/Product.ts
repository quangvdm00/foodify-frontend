import { Category } from "./Category";
import { ProductImage } from "./ProductImage";
import { Shop } from "./Shop";

export class Product {

    id: number;
    name: string;
    description: string;
    isEnabled: boolean;
    discountPercent: number;
    cost: number;
    averageRating: number;
    reviewCount: number;

    sold: number;
    categoryNames: string[];
    categories: Category[];
    images: ProductImage[];

    shopId: number;
    shop: Shop;
}

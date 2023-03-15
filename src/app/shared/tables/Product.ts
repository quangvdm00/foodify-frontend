import {Shop} from "../service/Shop";

export class Product {

    private _id: number;
    private _name: string;
    private _description: string;
    private _isEnabled: boolean;
    private _discountPercent: number;
    private _cost: bigint;
    private _averageRating: number;
    private _reviewCount: number;
    private _shop: Shop;
    private _images: string[];
    private _categories: string[];

}

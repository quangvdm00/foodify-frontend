import { Address } from "./address";
import { Product } from "./Product";

export class User {
    private id: string;
    private email: string
    private fullName: string
    private dateOfBirth: string
    private phoneNumber: string
    private imageUrl: string
    private createdTime: string
    private identifiedCode: string
    private defaultAddress: null
    private addresses: Address[]
    private products: Product[]
    private isLocked: boolean
    private roleName: string
}
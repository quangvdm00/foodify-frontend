import { Address } from "./Address";

export class User {
    id: number;
    email: string;
    phoneNumber: string;
    fullName: string;
    dateOfBirth: string;
    imageUrl: string;
    isLocked: boolean;
    identifiedCode: string;
    roleName: string;
    defaultAddress: number

    //Response
    addresses: Address[]
}
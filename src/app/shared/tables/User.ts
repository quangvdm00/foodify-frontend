import { Address } from "./Address";
import { Role } from "./Role";

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
    role: Role;
}
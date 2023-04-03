import { Address } from "./address";

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

    // create a new user
    addresses: Address[]
}

export class UserCreate {
    addressDto: {
      address: string;
      district: string;
      ward: string;
    };
    dateOfBirth: string;
    email: string;
    fullName: string;
    identifiedCode: string;
    imageUrl: string;
    isLocked: boolean;
    phoneNumber: string;
    roleName: string;
  }


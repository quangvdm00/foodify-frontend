import { Address } from "./address";
import { Product } from "./Product";

export class User {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  imageUrl: string;
  createdTime: string;
  identifiedCode: string;
  defaultAddress: null;
  addresses: Address[];
  products: Product[];
  isLocked: boolean;
  roleName: string;
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

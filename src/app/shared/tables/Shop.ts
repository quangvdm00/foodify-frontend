import { Address } from "./Address";
import { User } from "./User";

export class Shop {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    isEnabled: boolean;
    isStudent: boolean;
    userId: number;
    lat: string;
    lng: string

    //Response
    user: User
}

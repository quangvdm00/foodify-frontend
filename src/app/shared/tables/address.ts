import { District } from "./district";
import { Ward } from "./ward";

export class Address {
    id: string;
    address: string
    district: District
    ward: Ward
}
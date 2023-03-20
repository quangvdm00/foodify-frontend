import { District } from "./district";
import { Ward } from "./ward";

export class Address {
    private id: string;
    private address: string
    private district: District
    private ward: Ward
}
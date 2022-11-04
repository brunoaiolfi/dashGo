import { Stock } from "./stock";
export interface Product {
  id: number;
  name: string;
  value: number;
  Stock: Stock[];
}

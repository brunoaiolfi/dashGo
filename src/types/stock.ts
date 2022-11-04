import { Product } from "./product";

export type Stock = {
  id: number;
  qntd: number;
  productId: number;
  product?: Product;
};

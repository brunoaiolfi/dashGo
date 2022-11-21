import { Product } from "./product";

export type ItemPurchase = {
    id: number;
    qntd: number;
    dtCreated: Date;
    productId: number;
    product: Product;
    userId: number;
    purchasesId: number;
};

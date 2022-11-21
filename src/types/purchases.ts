import { Client } from "./client";
import { ItemPurchase } from "./ItemPurchases";

export type Purchases = {
  id: number;
  value: number;
  ItemPurchase: ItemPurchase[];
  Client: Client;
  dtCreated: Date;
  userId: number | null;
  clientId: number | null;
};

export type formattedPurchases = {
  id: number;
  value: number;
  dtCreated: string;
};

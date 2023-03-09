import { IAddress } from "./address";
import { IProduct } from "./product";
import { IUser } from "./user";

export interface IOrder {
  _id?: string;
  totalPayment: number;
  addressShipping: IAddress | null;
  idPayment: string;
  products: [];
  user?: IUser | null;
}

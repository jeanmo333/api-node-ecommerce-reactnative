import { IProduct } from "./product";

export interface IBanner {
  _id?: string;
  banner: string;
  product: IProduct | null;
  position: number;
}

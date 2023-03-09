import { IProduct } from "./product";
import { IUser } from "./user";

export interface IFavorite {
  _id?: string;
  product?: IProduct | null;
  user?: IUser | null;
}

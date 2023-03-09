import { IUser } from "./user";

export interface IProduct {
  _id?: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  quantity?: number;
  images: string[];
  tags: string[];
  user?: IUser | null;
  isFavorite: boolean;
}

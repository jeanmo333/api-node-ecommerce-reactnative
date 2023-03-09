import { IUser } from "./user";

export interface IAddress {
  _id: string;
  title: string;
  name_lastname: string;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  user?: IUser | null;
}

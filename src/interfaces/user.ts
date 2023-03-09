export interface IUser {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  password?: string;
  phone: string;
  web: string;
  token?: string;
  address?: string;
  isActive: boolean;
  image: string;
  roles: string;

  createdAt?: string;
  updatedAt?: string;
}

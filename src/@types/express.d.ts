import { IUpload } from "../interfaces/upload";
import { IUser } from "../interfaces/user";

declare global {
  namespace Express {
    export interface Request {
      user: IUser | null;
      // files: IUpload | null;
    }
  }
}

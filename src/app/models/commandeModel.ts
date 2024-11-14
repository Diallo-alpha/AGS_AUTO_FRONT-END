import { UserModel } from "./userModel";

export interface CommandeModel {
  id: number;
  somme: number;
  status: string;
  created_at: string;
  user: UserModel;
}

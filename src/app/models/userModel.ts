export interface UserModel {
  id?: number;
  nom_complet: string;
  email: string;
  telephone: string;
  photo?: string;
  password?: string;
  role?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserModel;
}

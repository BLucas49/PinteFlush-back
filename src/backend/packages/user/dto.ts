import { IResponse } from "../../core/base/Response.js";

/** Profil visible par n'importe quel utilisateur connecté. */
export interface PublicUser extends IResponse {
  id: string;
  firstName: string;
  lastName: string;
  elo: number;
  bio: string | null;
  createdAt: Date;
}

/** Profil complet, réservé à l'utilisateur lui-même. */
export interface UserDetails extends PublicUser {
  email: string;
}

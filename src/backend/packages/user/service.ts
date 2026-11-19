import { AService } from "../../core/base/Service.js";
import { NotFoundError } from "../../core/types/errors.js";
import { User } from "../../db/Users/Users.model.js";
import { PublicUser, UserDetails } from "./dto.js";

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  firstName: user.first_name,
  lastName: user.last_name,
  elo: user.elo,
  bio: user.bio,
  createdAt: user.created_at,
});

export class UsersService extends AService {
  /** L'email n'est renvoyé que si l'utilisateur consulte son propre profil. */
  public getProfile = async (
    userId: string,
    requesterId: string,
  ): Promise<PublicUser | UserDetails> => {
    const user = await this.rManager.Users().findById(userId);
    if (user === null) throw new NotFoundError("Utilisateur");

    return user.id === requesterId
      ? { ...toPublicUser(user), email: user.email }
      : toPublicUser(user);
  };
}

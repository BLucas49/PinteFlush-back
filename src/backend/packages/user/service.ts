import { AService } from "../../core/base/Service.js";
import { UserDetails } from "./dto.js";

export class UsersService extends AService {
  public getUserDetails = async (userId: string) => {
    const user = await this.rManager.Users().findById(userId);
    return <UserDetails>{
      id: user.id,
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      created_at: user.created_at,
    };
  };
}

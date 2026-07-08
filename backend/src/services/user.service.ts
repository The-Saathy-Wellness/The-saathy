import { AppError } from "../exceptions/AppError";
import { UserRepository } from "../repositories/user.repository";
import { updateProfileSchema } from "../validators/user.validators";

export class UserService {
  constructor(private readonly users = new UserRepository()) {}

  async me(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found");
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: string, input: typeof updateProfileSchema._type) {
    const user = await this.users.update(userId, input);
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found");
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

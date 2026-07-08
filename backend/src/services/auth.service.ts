import bcrypt from "bcryptjs";
import { AppError } from "../exceptions/AppError";
import { UserRepository } from "../repositories/user.repository";
import { signAccessToken } from "../utils/jwt";
import { loginSchema, registerSchema } from "../validators/auth.validators";

export class AuthService {
  constructor(private readonly users = new UserRepository()) {}

  async register(input: typeof registerSchema._type) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "EMAIL_ALREADY_EXISTS", "An account already exists for this email");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.users.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      ageRange: input.ageRange,
      location: input.location,
      language: input.language,
      moods: input.moods,
    });

    const authUser = { id: user.id, email: user.email, role: user.role };
    return { user: authUser, token: signAccessToken(authUser) };
  }

  async login(input: typeof loginSchema._type) {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const authUser = { id: user.id, email: user.email, role: user.role };
    return { user: authUser, token: signAccessToken(authUser) };
  }
}

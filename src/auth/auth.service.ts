import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

export interface Credentials {
  user_id: string;
  user_role: Role;
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.getOneByEmail(email);
    if (user) {
      const matchPasswords = await user.validatePassword(pass);
      if (matchPasswords) {
        user.password = undefined; // Ensure password is not returned
        return user;
      }
    }
    return null;
  }

  login(user: User): Credentials {
    const payload = {
      user_alias: user.alias,
      user_id: user.id,
      user_role: user.role,
    };
    return {
      user_id: user.id,
      user_role: user.role,
      access_token: this.jwtService.sign(payload),
    };
  }
}

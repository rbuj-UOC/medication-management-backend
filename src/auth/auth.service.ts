import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getOneByEmail(email);
    if (user) {
      const matchPasswords = await user.validatePassword(pass);
      if (matchPasswords) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      user_alias: user.alias,
      user_id: user.id,
      user_role: user.role,
    };
    return {
      user_id: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }
}

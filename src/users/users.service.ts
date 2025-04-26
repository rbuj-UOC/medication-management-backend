import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addUser(userData: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return await this.userRepository.remove(user);
  }

  async getAll() {
    return await this.userRepository.find();
  }

  async getOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getOneByUsername(alias: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { alias } });
    if (!user) {
      throw new NotFoundException(`User with username ${alias} not found`);
    }
    return user;
  }

  async getOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'alias', 'email', 'password', 'role'],
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async updateUser(id: string, updateData: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.userRepository.merge(user, updateData);
    return await this.userRepository.save(user);
  }

  async updateUserByUserId(
    id: string,
    userId: string,
    updateData: UpdateUserDTO,
  ): Promise<User> {
    if (id === userId) {
      throw new BadRequestException(
        'You cannot update your own user data with this endpoint',
      );
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.userRepository.merge(user, updateData);
    return await this.userRepository.save(user);
  }
}

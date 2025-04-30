import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { NotificationDto } from 'src/notification/dto/create-notification.dto';
import { UpdateNotificationDto } from 'src/notification/dto/update-notification.dto';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { SelectUserDTO } from './dto/select-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  async addContact(id: string, contactData: SelectUserDTO): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['contacts'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.email === contactData.email) {
      throw new BadRequestException('You cannot add yourself as a contact');
    }
    const contact = await this.userRepository.findOne({
      where: { email: contactData.email },
    });
    if (!contact || contact.role === Role.Admin) {
      throw new NotFoundException(
        `Contact with email ${contactData.email} not found`,
      );
    }
    user.contacts.push(contact);
    return await this.userRepository.save(user);
  }

  async addUser(userData: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return await this.userRepository.remove(user);
  }

  async deleteContact(id: string, contact: SelectUserDTO): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['contacts'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const contactToRemove = await this.userRepository.findOne({
      where: { email: contact.email },
    });
    if (!contactToRemove) {
      throw new NotFoundException(
        `Contact with email ${contact.email} not found`,
      );
    }
    user.contacts = user.contacts.filter(
      (contact) => contact.email !== contactToRemove.email,
    );
    return await this.userRepository.save(user);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getOne(id: string): Promise<User> {
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

  async getOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'alias', 'email', 'password', 'role', 'device_token'],
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async getUserContacts(id: string): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['contacts'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user.contacts;
  }

  async updateUser(id: string, updateData: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if ('password' in updateData) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
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

  async enablePush(userId: string, update_dto: NotificationDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return await this.notificationService.acceptPushNotification(
      user,
      update_dto,
    );
  }

  async disablePush(
    userId: string,
    update_dto: UpdateNotificationDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    await this.notificationService.disablePushNotification(user, update_dto);
  }

  async getPushNotifications(userId: string): Promise<any> {
    return await this.notificationService.getNotifications(userId);
  }
}

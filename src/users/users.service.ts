import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
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
    private schedulerRegistry: SchedulerRegistry,
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
    if (user.contacts.some((c) => c.email === contactData.email)) {
      throw new BadRequestException(
        `Contact with email ${contactData.email} already exists`,
      );
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
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['medications', 'medications.schedules'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Remove all the associated cron jobs
    for (const medication of user.medications) {
      const schedules = medication.schedules;
      for (const schedule of schedules) {
        const key = schedule.id.toString();
        console.log(`deleteTask: ${key}`);
        this.schedulerRegistry.deleteCronJob(key);
      }
    }
    // Delete the user
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
    return await this.userRepository.find({ order: { surname_1: 'ASC' } });
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
      order: {
        contacts: {
          surname_1: 'ASC',
        },
      },
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
}

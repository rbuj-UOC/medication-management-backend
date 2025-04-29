import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Medication } from 'src/medications/entities/medications.entity';
import { NotificationToken } from 'src/notification/entities/notification-token.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Schedule } from 'src/schedules/entities/schedules.entity';
import { User } from 'src/users/entities/users.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USERNAME,
    password: process.env.DB_ROOT_PASS,
    database: process.env.DB_NAME,
    entities: [User, Medication, Notification, NotificationToken, Schedule],
    synchronize: true,
  }),
);

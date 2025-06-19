import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Confirmation } from 'src/confirmations/entities/confirmations.entity';
import { Medication } from 'src/medications/entities/medications.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Schedule } from 'src/schedules/entities/schedules.entity';
import { User } from 'src/users/entities/users.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [User, Medication, Notification, Schedule, Confirmation],
    synchronize: true,
  }),
);

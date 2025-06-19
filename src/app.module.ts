import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { ConfirmationsModule } from './confirmations/confirmations.module';
import { MedicationsModule } from './medications/medications.module';
import { NotificationModule } from './notification/notification.module';
import { SchedulesModule } from './schedules/schedules.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig()),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    MedicationsModule,
    SchedulesModule,
    TasksModule,
    NotificationModule,
    ConfirmationsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}

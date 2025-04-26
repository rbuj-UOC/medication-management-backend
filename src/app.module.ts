import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { MedicationsModule } from './medications/medications.module';
import { SchedulesModule } from './schedules/schedules.module';
import { UsersModule } from './users/users.module';
import { VerificationsModule } from './verifications/verifications.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig()),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    MedicationsModule,
    VerificationsModule,
    SchedulesModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

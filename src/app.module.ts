import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { MedicationsModule } from './medications/medications.module';
import { SchedulesModule } from './schedules/schedules.module';
import { UsersModule } from './users/users.module';
import { UsersMedicationsSchedulesModule } from './users_medications_schedules/users_medications_schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig()),
    AuthModule,
    UsersModule,
    MedicationsModule,
    SchedulesModule,
    UsersMedicationsSchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

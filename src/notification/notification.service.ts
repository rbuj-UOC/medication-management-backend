import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }

  async getNotifications(userId: string): Promise<any> {
    return await this.notificationsRepo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async sendPush(user: User, title: string, body: string): Promise<void> {
    try {
      if (user.device_token) {
        await this.notificationsRepo.save({
          user: user,
          title,
          body,
          status: 'ACTIVE',
          created_by: user.email,
        });
        await admin
          .messaging()
          .send({
            notification: { title, body },
            token: user.device_token,
            android: { priority: 'high' },
          })
          .catch((error: any) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as firebase from 'firebase-admin';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

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
        await firebase
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

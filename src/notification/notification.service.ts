import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class NotificationService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }

  async sendPush(user: User, title: string, body: string): Promise<void> {
    try {
      if (user.device_token) {
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

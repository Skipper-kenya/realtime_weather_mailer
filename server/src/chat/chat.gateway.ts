import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import axios, { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { Notifications } from 'src/weather/schema/notifications.schema';
import { format } from 'date-fns';

@WebSocketGateway(3004, {
  cors: {
    origin: process.env.CLIENT_URI,
    credentials: true
  }
})
@Injectable()
export class ChatGateway {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Notifications.name)
    private notificationsModel: Model<Notifications>
  ) {}

  private pref = '';
  private loc = '';

  private readonly api_url: string = `https://api.openweathermap.org/data/2.5/weather?units=metric/&appid=${process.env.API_KEY}&q=`;

  @WebSocketServer()
  server;

  @SubscribeMessage('chat')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('chat_response', { message });
  }

  async initiateMail(email): Promise<void> {
    const cachePreference: string = await this.cacheManager.get(
      `${email}:preference`
    );
    const cacheLocation: string = await this.cacheManager.get(
      `${email}:location`
    );

    this.pref = cachePreference;
    this.loc = cacheLocation;

    this.pref?.toLowerCase() == 'rainy' ? (this.pref = 'rain') : 'rain';

    await this.server.emit('sendMail');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  @SubscribeMessage('sendMail')
  async sendMail(): Promise<void> {
    try {
      const response = await axios.get(`${this.api_url}${this.loc}`);
      const { weather } = response.data;
      const cachedEmail = this.loc.split(':')[0];

      this.pref?.toLowerCase() == 'rainy' ? (this.pref = 'rain') : 'rain';

      const notificationExists = await this.notificationsModel.findOne({
        email: cachedEmail
      });

      const timeNow = new Date().getTime();
      if (!notificationExists) {
        if (weather[0].main.toLowerCase() == this.pref?.toLowerCase()) {
          this.mailHandler(response.data?.weather[0].description);

          const newNotification = new this.notificationsModel({
            email: cachedEmail,
            lastSent: timeNow
          });
          await newNotification.save();
        }
      } else {
        const dbTime: number = notificationExists?.lastSent;
        if (
          weather[0].main.toLowerCase() == this.pref?.toLowerCase() &&
          timeNow - dbTime > 21600000
        ) {
          this.mailHandler(response.data?.weather[0].description);
          await this.notificationsModel.findOneAndUpdate(
            { email: cachedEmail },
            {
              $set: {
                lastSent: timeNow
              }
            }
          );
        }
      }
    } catch (error) {}
  }

  async mailHandler(description: any): Promise<void> {
    await this.mailerService.sendMail({
      from: process.env.FROMEMAIL,
      to: process.env.TOEMAIL,
      subject: 'weather updates in your area',
      text: description
    });
  }
}

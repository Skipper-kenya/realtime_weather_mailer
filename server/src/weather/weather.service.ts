import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { ChatGateway } from 'src/chat/chat.gateway';
import { Preference } from './schema/preference.schema';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
//
@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Preference.name) private preferenceModel: Model<Preference>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly chatGateWay: ChatGateway,
    private readonly mailerService: MailerService
  ) {}

  async getCurrentWeatherByDefault(
    url: string,
    location: string
  ): Promise<AxiosResponse<any>> {
    const response = await axios.get(`${url}${location}`);
    return response.data;
  }

  // @Cron(CronExpression.EVERY_MINUTE)
  async getCurrentWeatherByLocation(
    url: string,
    location: string
  ): Promise<AxiosResponse<any>> {
    try {
      const response = await axios.get(`${url}${location}`);
      return response.data;
    } catch (error) {}
  }

  async subscribeEmail(req: any): Promise<any> {
    const { location, preference, email } = req.body;

    const preferenceExists = await this.preferenceModel.findOne({ email });

    try {
      if (!preferenceExists) {
        const updatePreference = new this.preferenceModel({
          location,
          preference,
          email
        });
        await updatePreference.save();

        const currentPreference = await this.preferenceModel.findOne({
          email
        });

        await this.cacheManager.set(
          `${email}:location`,
          currentPreference?.location,
          0
        );
        await this.cacheManager.set(
          `${email}:preference`,
          currentPreference?.preference,
          0
        );

        this.chatGateWay.initiateMail(email);

        return {
          message: 'successfully subscribed to the messaging',
          success: true,
          currentPreference
        };
      }

      await this.preferenceModel.findOneAndUpdate(
        { email },
        {
          $set: {
            location,
            preference
          }
        }
      );
      const currentPreference = await this.preferenceModel.findOne({
        email
      });

      await this.cacheManager.set(
        `${email}:location`,
        currentPreference?.location,
        0
      );
      await this.cacheManager.set(
        `${email}:preference`,
        currentPreference?.preference,
        0
      );
      this.chatGateWay.initiateMail(email);

      return {
        message: 'successfully updated the messaging services',
        success: true,
        currentPreference
      };
    } catch (error) {
      return { success: false };
    }
  }

  async getPreference(email: string): Promise<any> {
    try {
      const currentPreference = await this.preferenceModel.findOne({ email });
      return { success: true, preference: currentPreference };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        preference: {
          _id: '',
          _v: 0,
          createdAt: '',
          updatedAt: '',
          email: '',
          location: '',
          preference: ''
        }
      };
    }
  }
}

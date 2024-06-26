import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Preference, PreferenceSchema } from './schema/preference.schema';
import {
  Notifications,
  notificationsSchema
} from './schema/notifications.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Preference.name, schema: PreferenceSchema },
      { name: Notifications.name, schema: notificationsSchema }
    ])
  ],
  controllers: [WeatherController],
  providers: [WeatherService, ChatGateway]
})
export class WeatherModule {}

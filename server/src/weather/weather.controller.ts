import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  private readonly apiKey: string = process.env.API_KEY;

  private readonly api_url: string = `https://api.openweathermap.org/data/2.5/weather?units=metric/&appid=${this.apiKey}&q=`;

  private defaultLocation: string = 'nairobi';

  @Get()
  async getCurrentWeatherByCity(): Promise<any> {
    return this.weatherService.getCurrentWeatherByDefault(
      this.api_url,
      this.defaultLocation
    );
  }

  @Get('/location/:location')
  async getCurrentWeatherByLocation(
    @Param()
    location: {
      location: string;
    }
  ): Promise<any> {
    return this.weatherService.getCurrentWeatherByLocation(
      this.api_url,
      location?.location
    );
  }

  @Post('/subscribe')
  async subscribeEmail(@Req() req: any): Promise<any> {
    return this.weatherService.subscribeEmail(req);
  }

  @Get('/getPreference/:email')
  async getPreference(@Param('email') email: string): Promise<any> {
    return this.weatherService.getPreference(email);
  }
}

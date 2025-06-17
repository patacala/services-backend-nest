import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio;

  constructor(private config: ConfigService) {
    this.client = new Twilio(
      config.get<string>('TWILIO_ACCOUNT_SID'),
      config.get<string>('TWILIO_AUTH_TOKEN')
    );
  }

  async sendSms(to: string, body: string) {
    return this.client.messages.create({
      from: this.config.get<string>('TWILIO_PHONE_NUMBER'),
      to,
      body,
    });
  }
}

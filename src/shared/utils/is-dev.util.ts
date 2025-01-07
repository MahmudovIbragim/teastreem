/* eslint-disable prettier/prettier */
import * as dotenv from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

dotenv.config();

export function isDev(configService: ConfigService) {
  return configService.getOrThrow<string>('NODE_ENV') === 'development';
}

export const IS_DEV_ENV = process.env.NODE_ENV === 'development';

import { ConfigService } from '@nestjs/config';

export function isDev(configService: ConfigService) {
  return configService.get<string>('NODE_ENV') === 'development';
}

export const IS_DEV_ENV = (configService: ConfigService) =>
  configService.get<string>('NODE_ENV') === 'development';

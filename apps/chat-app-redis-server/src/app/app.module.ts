import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewaysModule } from './gateways/gateways.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';

@Module({
	imports: [GatewaysModule, RedisCacheModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}

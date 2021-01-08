import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
	imports: [RedisCacheModule],
	providers: [ChatGateway]
})
export class GatewaysModule {}

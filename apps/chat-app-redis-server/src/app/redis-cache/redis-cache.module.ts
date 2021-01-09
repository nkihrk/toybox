import { CacheModule, Module } from '@nestjs/common';
import { RedisCacheService } from './services/redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
	imports: [
		CacheModule.register({
			store: redisStore,
			host: 'localhost',
			port: 6379
		})
	],
	providers: [RedisCacheService],
	exports: [RedisCacheService]
})
export class RedisCacheModule {}

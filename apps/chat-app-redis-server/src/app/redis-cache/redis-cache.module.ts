import { CacheModule, Module } from '@nestjs/common';
import { RedisCacheService } from './services/redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		CacheModule.register({
			store: redisStore,
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT)
		})
	],
	providers: [RedisCacheService],
	exports: [RedisCacheService]
})
export class RedisCacheModule {}

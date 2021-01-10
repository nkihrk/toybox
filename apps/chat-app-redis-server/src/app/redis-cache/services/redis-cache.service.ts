import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
	private readonly TTL = 86400; // for a whole day

	constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async get($key: string): Promise<any> {
		return await this.cache.get($key);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async mget(...$args: string[]): Promise<any> {
		return await this.cache.store.mget($args);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async set($key: string, $value: any): Promise<void> {
		await this.cache.set($key, $value, { ttl: this.TTL });
	}

	async reset(): Promise<void> {
		await this.cache.reset();
	}

	async del($key: string): Promise<void> {
		await this.cache.del($key);
	}
}

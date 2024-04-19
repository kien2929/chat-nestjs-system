import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: any) {
    return await this.cacheManager.set(key, value);
  }

  async del(key: string) {
    return await this.cacheManager.del(key);
  }
}

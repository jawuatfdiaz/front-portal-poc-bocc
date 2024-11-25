import { CacheService } from "../cache-resolver.service";

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
  });

  it('should be created', () => {
    expect(cacheService).toBeTruthy();
  });

  it('should save response to cache', () => {
    const key = 'testKey';
    const data = { message: 'test message' };

    cacheService.saveResponseToCache(key, data);

    expect(cacheService.getResponseFromCache(key)).toEqual(data);
  });

  it('should get response from cache', () => {
    const key = 'testKey';
    const data = { message: 'test message' };

    cacheService.saveResponseToCache(key, data);

    expect(cacheService.getResponseFromCache(key)).toEqual(data);
  });

  it('should remove response from cache', () => {
    const key = 'testKey';
    const data = { message: 'test message' };

    cacheService.saveResponseToCache(key, data);
    cacheService.removeFromCache(key);

    expect(cacheService.getResponseFromCache(key)).toBeUndefined();
  });
});

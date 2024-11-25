import { Injectable } from "@angular/core";

@Injectable({providedIn: 'any'})

export class CacheService {
  private cache: { [key: string]: any } = {};

  // constructor() { }

  getResponseFromCache(key: string): any {
    return this.cache[key];
  }

  saveResponseToCache(key: string, data: any): void {
    this.cache[key] = data;
  }

  removeFromCache(key: string): void {
    delete this.cache[key];
  }
}
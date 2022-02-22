import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JsonDbService {
  private db: JsonDB;
  constructor() {
    this.db = new JsonDB(new Config('store', true, false, '/'));
  }

  read<T>(key: string): T {
    return this.db.getData(key);
  }

  upsert<T>(key: string, data: T) {
    this.db.push(key, data);
  }
}

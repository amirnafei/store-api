import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JsonDbService } from '../json-db/json-db.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, JsonDbService, {provide: APP_GUARD, useClass: JwtAuthGuard}],
})
export class ProductsModule {}

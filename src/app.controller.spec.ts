import { Test, TestingModule } from '@nestjs/testing';
import { createRequest, createResponse } from 'node-mocks-http';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, UsersService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should login', () => {
      const req = createRequest({
        method: 'POST',
        url: '/login',
        params: {
          username: 'user1',
          password: 'pass1',
        }
      });
      const res = createResponse();
      const user = appController.login(req);
      expect(user).toBe('user1');
    });
  });
});

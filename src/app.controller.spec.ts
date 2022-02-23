import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createRequest, createResponse } from 'node-mocks-http';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AuthService],
    })
    .overrideProvider(AuthService)
    .useValue({login: jest.fn(async () => Promise.resolve({ access_token: 'mock_token'}))})
    .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should login', async () => {
      const { access_token } = await appController.login({});
      expect(access_token).toBe('mock_token');
    });
  });
});

import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    })
    .overrideProvider(UsersService)
    .useValue({findOne: jest.fn(username => username === 'user1' && ({
      userId: 1,
      username: 'user1',
      password: 'pass1',
    }))})
    .overrideProvider(JwtService)
    .useValue({})
    .compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should find user1', () => {
    expect(usersService.findOne('user1')).toEqual({
      userId: 1,
      username: 'user1',
      password: 'pass1',
    });
  });

  it('should not find user2', () => {
    expect(usersService.findOne('user2')).toEqual(false);
  });
});

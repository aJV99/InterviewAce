import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { UnauthorizedException } from '@nestjs/common';

class AuthServiceMock {
  validateUserByEmail = jest.fn();
  validateUserById = jest.fn();
  login = jest.fn();
  getRefreshToken = jest.fn();
  sendEmail = jest.fn();
  createPasswordResetToken = jest.fn();
  reportBug = jest.fn();
  resetPassword = jest.fn();
  createAccessTokenFromRefreshToken = jest.fn();
}

class UserServiceMock {
  create = jest.fn();
  findOneByEmail = jest.fn();
  get = jest.fn();
  findOneByResetToken = jest.fn();
  update = jest.fn();
  deleteData = jest.fn();
  delete = jest.fn();
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthServiceMock;
  let userService: UserServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        },
        {
          provide: UserService,
          useClass: UserServiceMock,
        },
      ],
    }).compile();

    controller = module.get(AuthController);
    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('signUp', () => {
    it('should create a new user successfully', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      userService.create.mockResolvedValue({ id: 1, email: 'test@example.com' });

      await controller.signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ id: 1, email: 'test@example.com' });
    });
  });

  describe('logout', () => {
    it('should clear the refresh token cookie and log the user out', async () => {
      const req = {};
      const res = { cookie: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

      await controller.logout(req, res);

      expect(res.cookie).toHaveBeenCalledWith('Refresh', '', expect.anything());
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { cookie: jest.fn(), send: jest.fn() };
      authService.validateUserByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });
      authService.login.mockResolvedValue({ accessToken: 'access-token' });
      authService.getRefreshToken.mockResolvedValue('refresh-token');

      await controller.login(req, res);

      expect(res.cookie).toHaveBeenCalledWith('Refresh', 'refresh-token', expect.anything());
      expect(res.send).toHaveBeenCalledWith({ accessToken: 'access-token' });
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const req = { body: { email: 'bad@example.com', password: 'badpassword' } };
      const res = {};
      authService.validateUserByEmail.mockResolvedValue(null);

      await expect(controller.login(req, res)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should handle forgot password functionality', async () => {
      const forgotPasswordDto = { email: 'test@example.com' };
      authService.createPasswordResetToken.mockResolvedValue(undefined);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(result).toEqual({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    });
  });

  describe('resetPassword', () => {
    it("should reset a user's password successfully", async () => {
      const resetPasswordDto = { email: 'test@example.com', token: 'some-token', password: 'newpassword' };
      authService.resetPassword.mockResolvedValue(undefined);

      const result = await controller.resetPassword(resetPasswordDto);

      expect(result).toEqual({
        message: 'Your password has been successfully reset.',
      });
    });
  });

  describe('bugReport', () => {
    it('should handle a bug report submission', async () => {
      const bugReportDto = {
        title: 'something went wrong',
        description: 'something went horribly wrong',
        email: 'test.user@email.com',
      };
      authService.reportBug.mockResolvedValue(undefined);

      const result = await controller.bugReport(bugReportDto);

      expect(result).toEqual({
        message: 'A bug report has been sent to the admin.',
      });
    });
  });
});

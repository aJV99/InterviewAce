import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RefreshGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.cookies && request.cookies.Refresh;
  }
}
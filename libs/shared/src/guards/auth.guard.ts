import { Observable, catchError, of, switchMap } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') return false;

    const authHeader = context.switchToHttp().getRequest().headers[
      'authorization'
    ] as string;

    if (!authHeader) return false;

    const authHeaderParts = authHeader.split(' ');

    if (authHeaderParts.length !== 2) return false;

    const [, jwt] = authHeaderParts;

    return this.authService.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
      switchMap(({ user }) => {
        if (!user) return of(false);

        return of(user);
      }),
      catchError(() => {
        throw new UnauthorizedException();
      }),
    );
  }
}

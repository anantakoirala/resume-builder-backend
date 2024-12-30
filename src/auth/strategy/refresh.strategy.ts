import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
// export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
//   constructor(
//     private readonly userService: UsersService,
//     private readonly authService: AuthService,
//   ) {
//     //const extractors = [(request: Request) => request?.cookies?.Refresh];
//     super({
//       jwtFromRequest: RefreshStrategy.cookieExtractor,
//       ignoreExpiration: false,
//       secretOrKey: process.env.REFRESH_TOKEN_SECRET,
//     });
//   }

//   async validate(request: Request, payload: any) {
//     console.log('payload', payload.id);
//     // request.user is set automatically here
//     const refreshToken = request.cookies?.Refresh;
//     console.log('refresh token', refreshToken);
//     return this.authService.validateRefreshToken(payload, refreshToken);
//   }
//   private static cookieExtractor(req: Request): string | null {
//     if (
//       req &&
//       req.cookies &&
//       'Refresh' in req.cookies &&
//       req.cookies.Refresh.length > 0
//     ) {
//       return req.cookies.Refresh;
//     }
//     return null;
//   }
// }
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: RefreshStrategy.cookieExtractor,
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
    });
  }

  async validate(request: Request, payload: any) {
    const refreshToken = request.cookies.Refresh;
    //console.log('payload id', payload.id);
    // request.user is set automatically here
    const user = await this.authService.validateRefreshToken(
      payload.id,
      refreshToken,
    );
    //console.log('refresh user', user.id);
    return user;
  }
  private static cookieExtractor(req: Request): string | null {
    if (
      req &&
      req.cookies &&
      'Refresh' in req.cookies &&
      req.cookies.Refresh.length > 0
    ) {
      //console.log('refresh cookie', req.cookies.Refresh);
      return req.cookies.Refresh;
    }
    return null;
  }
}

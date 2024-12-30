import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: JwtStrategy.cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    //console.log('payload', payload);
    // request.user is set automatically here
    return await this.userService.findOneById(payload.id);
  }
  private static cookieExtractor(req: Request): string | null {
    if (
      req &&
      req.cookies &&
      'Authentication' in req.cookies &&
      req.cookies.Authentication.length > 0
    ) {
      return req.cookies.Authentication;
    }
    return null;
  }
}

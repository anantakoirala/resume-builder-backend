import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'identifier' } as IStrategyOptions);
  }

  async validate(identifier: string, password: string) {
    try {
      // here user is set to request automatically by passport
      return await this.authService.authenticate({ identifier, password });
    } catch (error) {
      throw new BadRequestException('Inalid Credentials');
    }
  }
}

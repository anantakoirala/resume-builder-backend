import { InternalServerErrorException } from '@nestjs/common';
import { CookieOptions } from 'express';

export const getCookieOptions = (
  grantType: 'access' | 'refresh',
): CookieOptions => {
  // Options For Access Token
  if (grantType === 'access') {
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure: (process.env.PUBLIC_URL ?? '').includes('https://'),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 15 minutes from now
    };
  }

  // Options For Refresh Token
  if (grantType === 'refresh') {
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure: (process.env.PUBLIC_URL ?? '').includes('https://'),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    };
  }

  throw new InternalServerErrorException('InvalidGrantType: ' + grantType);
};

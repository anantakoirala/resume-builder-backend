import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterDto } from './dto/Register.dto';
import { getCookieOptions } from './utils/cookie';
import { Response } from 'express';
import { User } from 'src/users/decorators/user.decorator';
import { LocalGuard } from './guards/local.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private async exchangeToken(
    id: string,
    email: string,
    isTwoFactorAuth = false,
  ) {
    try {
      const payload = {
        id: id,
        isTwoFactorAuth: isTwoFactorAuth,
      };
      const accessToken = this.authService.generateToken('access', payload);
      const refreshToken = this.authService.generateToken('refresh', payload);
      await this.authService.setRefreshToken(email, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error, 'something went wrong');
    }
  }

  private async handleAuthenticationReponse(
    user: any,
    response: Response,
    isTwoFactorAuth = false,
    redirect = false,
  ) {
    const status = 'authenticated';
    const { accessToken, refreshToken } = await this.exchangeToken(
      user.id,
      user.email,
      isTwoFactorAuth,
    );
    response.cookie('Authentication', accessToken, getCookieOptions('access'));
    response.cookie('Refresh', refreshToken, getCookieOptions('refresh'));

    response.status(200).send(user);
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@User() user: any, @Res() response: Response) {
    const res = await this.handleAuthenticationReponse(user, response, true);
    console.log('res', res);
    return res;
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.register(registerDto);
    return this.handleAuthenticationReponse(user, response);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @User() user: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.handleAuthenticationReponse(user, response);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(
    @User() user: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.setRefreshToken(user.email, null);

    response.clearCookie('Authentication');
    response.clearCookie('Refresh');
    const data = 'logged out successfully';

    response.status(200).send(data);
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

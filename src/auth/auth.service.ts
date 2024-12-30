import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/Register.dto';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  private hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await this.hash(registerDto.password);
    const newUser = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        username: registerDto.username,
        provider: 'email',
        emailVerified: false,
        secrets: {
          create: {
            password: hashedPassword,
            // Other fields for Secrets model if needed
          },
        },
      },
    });
    return newUser;
  }
  private compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async validatePassword(password: string, hashedPassword: string) {
    const isValid = await this.compare(password, hashedPassword);

    if (!isValid) {
      throw new BadRequestException('invalid credentials');
    }
  }

  async setRefreshToken(email: string, token: string | null) {
    console.log;
    const user = await this.prisma.user.update({
      where: { email },
      data: {
        secrets: {
          update: {
            refreshToken: token,
            lastSignedIn: token ? new Date() : undefined,
          },
        },
      },
    });
  }

  generateToken(
    grantType: 'access' | 'refresh' | 'reset' | 'verification',
    payload?: any,
  ) {
    switch (grantType) {
      case 'access':
        if (!payload)
          throw new InternalServerErrorException('InvalidTokenPayload');
        return this.jwtService.sign(payload, {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: '15m', // 15 minutes
        });

      case 'refresh':
        console.log('refresh');
        if (!payload)
          throw new InternalServerErrorException('InvalidTokenPayload');
        return this.jwtService.sign(payload, {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: '2d', // 2 days
        });

      case 'reset':
      case 'verification':
        return randomBytes(32).toString('base64url');

      default:
        throw new InternalServerErrorException(
          'InvalidGrantType: ' + grantType,
        );
    }
  }

  async authenticate({ identifier, password }: LoginDto) {
    try {
      const user = await this.userService.findOneByIdentifier(identifier);

      if (!user) {
        throw new BadRequestException('invalid credentials');
      }

      if (!user.secrets?.password) {
        throw new BadRequestException('OAuthUser');
      }

      await this.validatePassword(password, user.secrets?.password);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPassword, ...secretsWithoutPassword } =
        user.secrets;
      const userWithoutPassword = { ...user, secrets: secretsWithoutPassword };

      return userWithoutPassword;
    } catch (error) {
      throw new BadRequestException('invalid credentials');
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  async validateRefreshToken(payload: string, token: string) {
    console.log('refresg garna pugyo');
    const user = await this.userService.findOneById(payload);
    const { password: userPassword, ...secretsWithoutPassword } = user.secrets;
    const userWithoutPassword = { ...user, secrets: secretsWithoutPassword };
    const storedRefreshToken = user.secrets?.refreshToken;

    if (!storedRefreshToken || storedRefreshToken !== token)
      throw new ForbiddenException();

    return userWithoutPassword;
  }
}

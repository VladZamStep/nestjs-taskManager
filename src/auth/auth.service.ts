import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { DUPLICATE_USERNAME_CODE } from 'src/shared/consts';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const saltRounds = 10;
    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt(saltRounds);
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (err) {
      if (err.code === DUPLICATE_USERNAME_CODE) {
        throw new ConflictException('Username already exists.');
      } else throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  private async validatePassword(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else return null;
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.validatePassword(authCredentialsDto);
    if (!username) throw new UnauthorizedException('Invalid credentials.');

    const payload: JwtPayload = { username };

    const accessToken = this.jwtService.sign(payload);
    this.logger.debug(
      `JWT token with payload ${JSON.stringify(payload)} has been generated`,
    );
    return { accessToken };
  }
}

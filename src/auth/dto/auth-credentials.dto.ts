import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  password: string;
}

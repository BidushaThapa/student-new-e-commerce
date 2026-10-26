import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsString()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  PhoneNumber?: string;

  @IsString()
  address!: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}

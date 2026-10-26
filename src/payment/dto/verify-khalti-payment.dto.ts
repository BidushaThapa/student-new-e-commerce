import { IsString, IsUUID, MinLength } from 'class-validator';

export class VerifyKhaltiPaymentDto {
  @IsUUID()
  orderId!: string;

  @IsString()
  @MinLength(1)
  token!: string;
}

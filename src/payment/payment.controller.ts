import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '../users/auth/auth.guard';
import type { RequestWithUser } from '../users/decorators/user.decorator';
import { Roles } from '../users/decorators/roles.decorator';
import { RolesGuard } from '../users/auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { VerifyKhaltiPaymentDto } from './dto/verify-khalti-payment.dto';
@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  createPayment(@Req() req: RequestWithUser, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(req.user, dto);
  }

  @Post('confirm')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  confirmPayment(
    @Body('paymentId') paymentId: string,
    @Body('transactionId') transactionId: string,
  ) {
    return this.paymentsService.confirmPayment(paymentId, transactionId);
  }

  @Post('khalti/verify')
  verifyKhaltiPayment(
    @Req() req: RequestWithUser,
    @Body() dto: VerifyKhaltiPaymentDto,
  ) {
    return this.paymentsService.verifyKhaltiPayment(req.user, dto);
  }

  @Get('history')
  getUserPayments(@Req() req: RequestWithUser) {
    return this.paymentsService.getUserPayments(req.user);
  }
}

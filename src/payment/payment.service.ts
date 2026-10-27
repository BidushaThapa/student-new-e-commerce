import {
  BadGatewayException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyKhaltiPaymentDto } from './dto/verify-khalti-payment.dto';
import { ConfigService } from '@nestjs/config';
import type { PaymentMethod } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a new payment for a user's order
   */
  async createPayment(
    user: Pick<User, 'id'>,
    dto: CreatePaymentDto,
  ): Promise<Payment> {
    // Find the order and make sure it belongs to the user
    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId, userId: user.id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Create the payment entity
    const payment = this.paymentRepo.create({
      user,
      order,
      amount: order.totalPrice,
      status: 'pending',
    });

    return this.paymentRepo.save(payment);
  }

  async verifyKhaltiPayment(
    user: Pick<User, 'id'>,
    dto: VerifyKhaltiPaymentDto,
  ): Promise<Payment> {
    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId, userId: user.id },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentMethod !== ('khalti' as PaymentMethod)) {
      throw new ConflictException('Order is not a Khalti payment');
    }

    const secretKey = this.configService.get<string>('khalti.secretKey');
    if (!secretKey) {
      throw new ServiceUnavailableException(
        'Khalti secret key is not configured on the backend',
      );
    }

    const payment = await this.paymentRepo.findOne({
      where: { orderId: order.id, userId: user.id },
    });
    if (!payment) throw new NotFoundException('Payment record not found');

    const response = await fetch(
      this.configService.getOrThrow<string>('khalti.verifyUrl'),
      {
        method: 'POST',
        headers: {
          Authorization: `Key ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: dto.token,
          amount: Math.round(Number(order.totalAmount) * 100),
        }),
      },
    ).catch(() => {
      throw new BadGatewayException('Khalti verification request failed');
    });

    if (!response.ok) {
      throw new ConflictException('Khalti payment could not be verified');
    }

    const result = (await response.json()) as { idx?: string; token?: string };
    payment.status = 'completed';
    payment.transactionId = result.idx || result.token || dto.token;
    order.status = 'confirmed';
    await this.orderRepo.save(order);
    return this.paymentRepo.save(payment);
  }

  /**
   * Confirm a payment (mark as completed)
   */
  async confirmPayment(
    paymentId: string,
    transactionId: string,
  ): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['user', 'order'], // load relations if needed
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = 'completed';
    payment.transactionId = transactionId;

    return this.paymentRepo.save(payment);
  }

  /**
   * Get all payments for a specific user
   */
  async getUserPayments(user: Pick<User, 'id'>): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { user: { id: user.id } },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Optionally, get a single payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['user', 'order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import type { OrderStatus } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';

interface FindAllFilters {
  status?: OrderStatus;
  userId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filters: FindAllFilters): Promise<Order[]> {
    const { status, userId, page = 1, limit = 10 } = filters;

    const query = this.orderRepository.createQueryBuilder('order');

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (userId) {
      query.andWhere('order.userId = :userId', { userId });
    }

    query.skip((page - 1) * limit).take(limit);

    return query
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .getMany();
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: userId ? { id, userId } : { id },
      relations: { orderItems: { product: true } },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const products = await Promise.all(
        createOrderDto.orderItems.map((item) =>
          this.productRepository.findOneBy({ id: item.productId }),
        ),
      );
      if (products.some((product) => !product)) {
        throw new NotFoundException('One or more products were not found');
      }

      const orderItems = createOrderDto.orderItems.map((item, index) => {
        const product = products[index];
        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }
        return manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          price: Number(product.price),
        });
      });
      const total = orderItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      );
      const order = manager.create(Order, {
        userId,
        shippingAddress: createOrderDto.shippingAddress,
        paymentMethod: createOrderDto.paymentMethod,
        totalAmount: total,
        totalPrice: total,
        orderItems,
      });
      return manager.save(Order, order);
    });
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId?: string,
  ): Promise<Order> {
    const order = await this.findOne(id, userId);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    userId?: string,
  ): Promise<Order> {
    const order = await this.findOne(id, userId);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const order = await this.findOne(id, userId);
    await this.orderRepository.remove(order);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import type { OrderStatus } from './entities/order.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AuthGuard } from '../users/auth/auth.guard';
import { UserRole } from '../users/entities/user.entity';
import type { RequestWithUser } from '../users/decorators/user.decorator';
import { Roles } from '../users/decorators/roles.decorator';
import { RolesGuard } from '../users/auth/roles.guard';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Query('status') status?: OrderStatus,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const filters = {
      status,
      page,
      limit,
      userId: req.user.role === UserRole.ADMIN ? undefined : req.user.id,
    };
    return this.ordersService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.ordersService.findOne(
      id,
      req.user.role === UserRole.ADMIN ? undefined : req.user.id,
    );
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: RequestWithUser) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: RequestWithUser,
  ) {
    return this.ordersService.update(
      id,
      updateOrderDto,
      req.user.role === UserRole.ADMIN ? undefined : req.user.id,
    );
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req: RequestWithUser,
  ) {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto.status,
      req.user.role === UserRole.ADMIN ? undefined : req.user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.ordersService.remove(
      id,
      req.user.role === UserRole.ADMIN ? undefined : req.user.id,
    );
  }
}

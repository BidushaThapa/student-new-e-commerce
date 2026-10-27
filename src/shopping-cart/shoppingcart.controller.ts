import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ShoppingCartService } from './shoppingcart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthGuard } from '../users/auth/auth.guard';
import { type RequestWithUser } from '../users/decorators/user.decorator';

@Controller('shopping-cart')
@UseGuards(AuthGuard)
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get()
  getCart(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.shoppingCartService.getUserCart(userId);
  }

  @Post()
  addToCart(@Req() req: RequestWithUser, @Body() dto: AddToCartDto) {
    return this.shoppingCartService.addToCart(req.user, dto);
  }

  @Put(':id')
  updateQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
    @Req() req: RequestWithUser,
  ) {
    return this.shoppingCartService.updateQuantity(id, quantity, req.user);
  }

  // "clear" must come BEFORE ":id" to avoid matching "clear" as an id
  @Delete('clear')
  clearCart(@Req() req: RequestWithUser) {
    return this.shoppingCartService.clearCart(req.user);
  }

  @Delete(':id')
  removeItem(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.shoppingCartService.removeItem(id, req.user);
  }
}

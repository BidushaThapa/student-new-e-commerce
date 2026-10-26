import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { Product } from './entities/product.entity';
import { AuthGuard } from '../users/auth/auth.guard';
import { RolesGuard } from '../users/auth/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  addProduct(@Body() productBody: CreateProductDto) {
    return this.productService.addProduct(productBody);
  }
  @Put('/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') id: string,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }
  @Get('/')
  getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }
  @Get('/:id')
  getOneProduct(@Param('id') id: string) {
    return this.productService.getOneProduct(id);
  }
  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  DeleteOneProduct(@Param('id') id: string) {
    return this.productService.deleteOneProduct(id);
  }
}

//     @Post()//body lina laii
// createProduct(
//     @Req()req:express.Request,
//     @Res()res:express.Response,
//     @Body('name')name:string,
//     @Body('price')price:number,
// ):void{
//     console.log(req);
//     console.log(name,price);
//     res.status(HttpStatus.CREATED).send({
//         message:`Product ${name} with price ${price} created successfully!`,
//     })
//     //return `Product ${name} with price ${price} created successfully!`
// }
// @Put('/:id')//:id route parameter
//    updateProduct(@Param('id')id:string,@Query('data')data:string):string{
//   if(id=="hello"){
//   throw new ForbiddenException('you are not allowed to update hello');
// }
//     return `Hello from put request and id is ${id} and data is ${data}`;
// }
// @Post('/create')
// addProduct(@Body()CreateProductDto:CreateProductDto){
// console.log(CreateProductDto);
// }
// @Delete('/:id')
// deleteProduct(@Param('id',ParseIntPipe)id:number):string{
//     console.log(typeof id);
//     return `Hello from delete request and id is ${id}`;
// }
// }
//query parameter:bv?data=hello
//dto vitra schema ko jastai

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/catagory.entity';
import { Order } from '../orders/entities/order.entity';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-products.dto';
import { CreateCategoryDto } from '../categories/dto/create-categories.dto';
import { UpdateCategoryDto } from '../categories/dto/update-categories.dto';
import type { OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
  ) {}

  async dashboard() {
    const [users, products, categories, orders] = await Promise.all([
      this.users.count(),
      this.products.count(),
      this.categories.count(),
      this.orders.find(),
    ]);
    return {
      totalUsers: users,
      totalProducts: products,
      totalCategories: categories,
      totalOrders: orders.length,
      totalRevenue: orders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0,
      ),
    };
  }

  usersList() {
    return this.users.find({
      select: ['id', 'name', 'email', 'PhoneNumber', 'address', 'role'],
      order: { name: 'ASC' },
    });
  }

  productsList() {
    return this.products.find({ order: { name: 'ASC' } });
  }

  createProduct(dto: CreateProductDto) {
    return this.products.save(this.products.create(dto));
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.products.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return this.products.save(this.products.merge(product, dto));
  }

  async deleteProduct(id: string) {
    const product = await this.products.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    await this.products.remove(product);
  }

  categoriesList() {
    return this.categories.find({ order: { name: 'ASC' } });
  }

  createCategory(dto: CreateCategoryDto) {
    return this.categories.save(this.categories.create(dto));
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    const category = await this.categories.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    return this.categories.save(this.categories.merge(category, dto));
  }

  async deleteCategory(id: number) {
    const category = await this.categories.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    await this.categories.remove(category);
  }

  ordersList() {
    return this.orders.find({
      relations: { orderItems: { product: true }, user: true },
      order: { orderDate: 'DESC' },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.orders.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orders.save(order);
  }
}

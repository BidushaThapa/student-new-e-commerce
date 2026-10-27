import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrderModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './upload/upload.module';
import { ShoppingCartModule } from './shopping-cart/shoppingcart.module';
import { PaymentsModule } from './payment/payment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { validateEnvironment } from './config/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
// import { AdminModule } from './users/admin.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validate: validateEnvironment,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'frontend'), // <-- your frontend folder
      exclude: ['/api/{*path}'], // keep backend API routes accessible
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.getOrThrow<string>('database.host'),
        port: configService.getOrThrow<number>('database.port'),
        username: configService.getOrThrow<string>('database.username'),
        password: configService.getOrThrow<string>('database.password'),
        autoLoadEntities: true,
        database: configService.getOrThrow<string>('database.databaseName'),
        synchronize: false,
      }),
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrderModule,
    UploadModule,
    PaymentsModule,
    ShoppingCartModule,
    AdminModule,
  ], //AdminModule
  controllers: [AppController],
  providers: [AppService],
  exports: [TypeOrmModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import {
  CategoryResolver,
  DishResolver,
  RestaurantResolver,
} from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { Dish } from './entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository])],
  providers: [
    RestaurantResolver,
    DishResolver,
    CategoryResolver,
    RestaurantService,
  ],
})
export class RestaurantsModule {}

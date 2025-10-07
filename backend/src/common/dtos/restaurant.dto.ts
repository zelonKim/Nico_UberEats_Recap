import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@InputType()
export class RestaurantInput {
  @Field(type => Int)
  restaurantId: number;
}

@ObjectType()
export class RestaurantOutput extends CoreOutput {
  @Field(type => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}

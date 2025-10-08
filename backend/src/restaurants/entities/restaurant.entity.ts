import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';
import { Dish } from './dish.entity';
import { Order } from 'src/orders/entities/order.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(type => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(type => String, { defaultValue: 'NewYork' })
  @Column()
  @IsString()
  address: string;

  @Field(type => Category, { nullable: true })
  @ManyToOne(
    // 모든 레스토랑은 하나의 카테고리만 가질 수 있음.
    type => Category,
    category => category.restaurants,
    { nullable: true, onDelete: 'SET NULL' }, // 카테고리가 삭제되도 레스토랑은 그대로 null값을 가짐.
  )
  category: Category;

  @Field(type => User)
  @ManyToOne(
    // 많은 유저는 하나의 레스토랑만 소유할 수 있음.
    type => User,
    user => user.restaurants,
    { onDelete: 'CASCADE' }, // 유저가 삭제되면 레스토랑도 같이 삭제됨.
  )
  owner: User;

  @Field(type => [Order])
  @OneToMany(
    type => Order,
    order => order.restaurant,
  )
  orders: Order;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field(type => [Dish])
  @OneToMany(
    type => Dish,
    dish => dish.restaurant,
  )
  menu: Dish[];
}

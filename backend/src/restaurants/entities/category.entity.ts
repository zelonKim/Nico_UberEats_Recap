import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field(type => String)
  @Column({ unique: true })
  @IsString()
  @Length(5)
  name: string;

  @Field(type => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImg: string;

  @Field(type => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @OneToMany(
    // 하나의 카테고리는 모든 레스토랑에 속할 수 있음.
    type => Restaurant,
    restaurant => restaurant.category,
  )
  @Field(type => [Restaurant])
  restaurants: Restaurant[];
}

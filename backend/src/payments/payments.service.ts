import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payments.entity';
import { LessThan, Repository } from 'typeorm';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { User } from 'src/users/entities/user.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { GetPaymentsOutput } from './dtos/get-payments.dto';
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    const restaurant = await this.restaurants.findOne(restaurantId);

    if (!restaurant) {
      return {
        ok: false,
        error: 'Restaurant not found',
      };
    }
    if (restaurant.ownerId !== owner.id) {
      return {
        ok: false,
        error: 'You are not allowed to do this',
      };
    }

    await this.payments.save(
      this.payments.create({
        transactionId,
        user: owner,
        restaurant,
      }),
    );

    restaurant.isPromoted = true;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    restaurant.promotedUntil = date;

    this.restaurants.save(restaurant);

    return {
      ok: true,
    };
  }
  catch(err) {
    return {
      ok: false,
      error: 'Could not found payment',
    };
  }

  async getPayments(user: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.payments.find({ user: user });
      return {
        ok: true,
        payments,
      };
    } catch (err) {
      return {
        ok: false,
        error: 'could not laod payment',
      };
    }
  }

  @Interval(2000)
  async checkPromotedRestaurants() {
    const restaurants = await this.restaurants.find({
      isPromoted: true,
      promotedUntil: LessThan(new Date()),
    });
    restaurants.forEach(restaurant => {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      await this.restaurants.save(restaurant);
    });
  }

  // @Cron('30 * * * * *', {
  //   name: 'myJob',
  // })
  // checkForPayments() {
  //   console.log('매분 30초에 실행됩니다.');
  //   const job = this.schedulerRegistry.getCronJob('myJob');
  //   job.stop();
  // }

  // @Interval(5000)
  // checkForPaymentsI() {
  //   console.log('50초 간격으로 실행됩니다.');
  // }

  // @Timeout(20000)
  // afterStarts() {
  //   console.log('20초가 지난뒤 한번 실행됩니다.');
  // }
}

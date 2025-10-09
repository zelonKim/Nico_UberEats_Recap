import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payments.entity';
import { PaymentService } from './payments.service';
import { PaymentResolver } from './payments.resolver';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Restaurant])],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentsModule {}

import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Payment } from './entities/payments.entity';
import { PaymentService } from './payments.service';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/role.decorator';
import { GetPaymentsOutput } from './dtos/get-payments.dto';

@Resolver(of => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(returns => CreatePaymentOutput)
  @Role(['Owner'])
  createPayment(
    @AuthUser() owner: User,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return this.paymentService.createPayment(owner, createPaymentInput);
  }

  @Query(returns => GetPaymentsOutput)
  @Role(['Owner'])
  getPayments(@AuthUser() owner: User): Promise<GetPaymentsOutput> {
    return this.paymentService.getPayments(owner);
  }
}

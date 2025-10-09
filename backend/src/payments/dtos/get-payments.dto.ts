import { CoreOutput } from 'src/common/dtos/output.dto';
import { Payment } from '../entities/payments.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPaymentsOutput extends CoreOutput {
  @Field(type => [Payment], { nullable: true })
  payments?: Payment[];
}

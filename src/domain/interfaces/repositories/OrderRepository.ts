import Order from '../../entities/Order';

import { Either } from '../either';

interface OrderRepository {
  get (criteria: {
    orderId: number | undefined,
    purchaseDateRange: {
      start: string;
      end: string;
    } | undefined
  }): Promise<Either<Error, Order[]>>
}

export default OrderRepository;
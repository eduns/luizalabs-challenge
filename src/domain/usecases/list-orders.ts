import Order from '../entities/Order';

import OrderRepository from '../interfaces/repositories/OrderRepository';

import { Either, left, right } from '../interfaces/either';

export type ListOrdersInput = {
  orderId: number | undefined;
  purchaseDateRange: {
    start: string;
    end: string;
  } | undefined
}

export type ListOrdersOutput = {
  orders: Order[];
}

export default class ListOrders {
  constructor (
    private readonly orderRepository: OrderRepository
  ) {}

  async execute (input: ListOrdersInput): Promise<Either<Error, ListOrdersOutput>> {
    const result = await this.orderRepository.get({
      orderId: input.orderId,
      purchaseDateRange: input.purchaseDateRange
    });

    if (result.isLeft()) {
      return left(result.value);
    }

    return right({ orders: result.value });
  }
}
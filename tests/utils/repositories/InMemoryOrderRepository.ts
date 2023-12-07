import Order from '../../../src/domain/entities/Order';
import Customer from '../../../src/domain/entities/Customer';
import Product from '../../../src/domain/entities/Product';

import OrderRepository from '../../../src/domain/interfaces/repositories/OrderRepository';

import { Either, right } from '../../../src/domain/interfaces/either';

export default class InMemoryOrderRepository implements OrderRepository {
  private readonly orders: Order[] = [
    new Order(1,
      new Customer(1, 'C1'),
      new Date('2020-12-01'),
    [
      new Product(1, 200), new Product(2, 400)
    ]),
    new Order(2,
      new Customer(2, 'C2'),
      new Date('2021-12-01'),
    [
      new Product(1, 200), new Product(2, 400)
    ]),
    new Order(3,
      new Customer(1, 'C1'),
      new Date('2020-12-01'),
    [
      new Product(3, 600), new Product(4, 800)
    ]),
    new Order(4,
      new Customer(2, 'C2'),
      new Date('2021-12-01'),
    [
      new Product(3, 600), new Product(4, 800)
    ]),
  ];

  async get (criteria: {
    orderId: number | undefined;
    purchaseDateRange: {
      start: string;
      end: string;
    } | undefined; }): Promise<Either<Error, Order[]>> {
    if (!criteria.orderId && !criteria.purchaseDateRange)
      return right(this.orders);

    let dateStart: number, dateEnd: number, orderDate: number;

    const orders = this.orders.filter(order => {
      if (criteria.orderId && criteria.purchaseDateRange) {
        dateStart = new Date(criteria.purchaseDateRange.start).valueOf();
        dateEnd = new Date(criteria.purchaseDateRange.end).valueOf();
        orderDate = order.date.valueOf();

        return criteria.orderId === order.id && orderDate >= dateStart && orderDate <= dateEnd;
      }

      if (criteria.orderId) {
        return criteria.orderId === order.id;
      }

      if (criteria.purchaseDateRange) {
        dateStart = new Date(criteria.purchaseDateRange.start).valueOf();
        dateEnd = new Date(criteria.purchaseDateRange.start).valueOf();
        orderDate = order.date.valueOf();

        return orderDate >= dateStart && orderDate <= dateEnd;
      }
    });

    return right(orders);
  }
}
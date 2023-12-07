import Order from '../../../domain/entities/Order';
import Customer from '../../../domain/entities/Customer';
import Product from '../../../domain/entities/Product';

import OrderRepository from '../../../domain/interfaces/repositories/OrderRepository';

import { Either, left, right } from '../../../domain/interfaces/either';

import { Pool } from 'pg';

export default class OrderRepositoryPostgres implements OrderRepository {
  constructor (private readonly connection: Pool) {}

  async get(criteria: {
    orderId: number | undefined;
    purchaseDateRange: { start: string; end: string; } | undefined;}
  ): Promise<Either<Error, Order[]>> {
    let queryString = `SELECT
      c.id AS customer_id,
      c.name AS customer_name,
      o.id AS order_id,
      o.date AS order_date,
      p.product_id,
      p.value AS product_value
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    JOIN products p ON o.id = p.order_id`;

    const queryValues: any[] = [];

    if (criteria.orderId || criteria.purchaseDateRange) {
      queryString += ' WHERE';

      if (criteria.orderId) {
        queryString += ' o.id = $1';
        queryValues.push(criteria.orderId);
      }

      if (criteria.purchaseDateRange) {
        queryString += criteria.orderId ?
        ' AND o.date BETWEEN TO_DATE($2, \'YYYY-MM-DD\') AND TO_DATE($3, \'YYYY-MM-DD\')' :
        ' o.date BETWEEN TO_DATE($1, \'YYYY-MM-DD\') AND TO_DATE($2, \'YYYY-MM-DD\')';
        queryValues.push(criteria.purchaseDateRange.start, criteria.purchaseDateRange.end);
      }
    }

    queryString += ' GROUP BY c.id, c.name, o.id, o.date, p.product_id, p.value ORDER BY c.name, o.id, o.date, p.product_id';

    try {
      const result = await this.connection.query(queryString, queryValues);
      
      const orders: any = {};
      result.rows.forEach(row => {
        if (!orders[row['order_id']])
          orders[row['order_id']] = {
            id: Number(row['order_id']),
            date: row['order_date'],
            products: [],
            customer: {
              id: Number(row['customer_id']),
              name: row['customer_name']
            }
          };
  
        orders[row['order_id']]['products'].push({
          id: Number(row['product_id']),
          value: Number(row['product_value'])
        });
      });
  
      const mapperOrders = Object.values(orders).map((order: any) => {
        return new Order(
          order['id'],
          new Customer(
            order['customer']['id'],
            order['customer']['name']
          ),
          order['date'],
          order['products'].map(p => new Product(p['id'], p['value']))
        );
      });

      return right(mapperOrders);
    } catch (error: any) {
      return left(error);
    }
  }
}
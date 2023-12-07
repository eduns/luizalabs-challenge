import LegacyDataRepository from '../../../domain/interfaces/repositories/LegacyDataRepository';

import { Either, left, right } from '../../../domain/interfaces/either';

import { Pool } from 'pg';

export default class LegacyDataRepositoryPostgres implements LegacyDataRepository {
  constructor (private readonly connection: Pool) {}

  async save (legacyData: {
    users: { id: number; name: string; }[];
    orders: { id: number; date: string; userId: number; }[];
    products: { id: number; value: number; orderId: number; }[];
  }): Promise<Either<Error, void>> {
    const usersValues = legacyData.users.map(u => `(${u.id}, ${/'/.test(u.name) ? '$$\''+ u.name + '\'$$' : '\'' + u.name + '\''})`).join(', ');
    const ordersValues = legacyData.orders.map(o => `(${o.id}, TO_DATE('${o.date}', 'YYYY-MM-DD'), ${o.userId})`).join(', ');
    const productsValues = legacyData.products.map(p => `(${p.orderId}, ${p.id}, ${p.value})`).join(', ');

    const client = await this.connection.connect();

    try {
      console.log('[Database] INFO|> Beginning Transaction...');

      await this.connection.query('BEGIN');
      await this.connection.query(`INSERT INTO customers (id, name) VALUES ${usersValues}`);
      await this.connection.query(`INSERT INTO orders (id, date, customer_id) VALUES ${ordersValues}`);
      await this.connection.query(`INSERT INTO products (order_id, product_id, value) VALUES ${productsValues}`);
      await this.connection.query('COMMIT');

      console.log('[Database] INFO|> Successful Inserts!');
    } catch (err: any) {
      console.error('[Database] ERROR|> Error on Transaction. Rollbacking... Cause:', err.message);
      await this.connection.query('ROLLBACK');
      return left(err);
    } finally {
      client.release();
    }
    return right(undefined);
  }
}
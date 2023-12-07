import LegacyDataRepository from '../../../src/domain/interfaces/repositories/LegacyDataRepository';

import { Either, right } from '../../../src/domain/interfaces/either';

export default class InMemoryLegacyDataRepository implements LegacyDataRepository {
  private users: { id: number; name: string; }[] = [];
  private orders: { id: number; userId: number; date: string }[] = [];
  private products: { id: number; value: number; orderId: number; }[] = [];

  async save (legacyData: {
    users: { id: number; name: string; }[];
    orders: { id: number; userId: number; date: string }[];
    products: { id: number; value: number; orderId: number; }[];
  }): Promise<Either<Error, void>> {
    this.users = legacyData.users;
    this.orders = legacyData.orders;
    this.products = legacyData.products;

    return right(undefined);
  }

  getAllUsers (): { id: number; name: string; }[] {
    return this.users;
  }

  getAllOrders (): { id: number; userId: number; date: string }[] {
    return this.orders;
  }

  getAllProducts (): { id: number; value: number; orderId: number }[] {
    return this.products;
  }
}
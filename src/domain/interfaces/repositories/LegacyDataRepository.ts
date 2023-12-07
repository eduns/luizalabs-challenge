import { Either } from '../either';

interface LegacyDataRepository {
  save (legacyData: {
    users: { id: number; name: string; }[];
    orders: { id: number; date: string, userId: number; }[];
    products: { id: number; value: number; orderId: number; }[];
  }): Promise<Either<Error, void>>
}

export default LegacyDataRepository;
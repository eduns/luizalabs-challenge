import ImportData from '../../../../src/domain/usecases/import-data';

import InMemoryLegacyDataRepository from '../../../utils/repositories/InMemoryLegacyDataRepository';

describe('ImportData Use Case', () => {
  it('should import data correctly', async () => {
    const repository = new InMemoryLegacyDataRepository();
    const usecase = new ImportData(repository);

    await usecase.execute({
      data: [
        {
          userId: 2,
          userName: 'Medeiros',
          orderId: 12345,
          productId: 111,
          productValue: 256.24,
          orderDate: '2020-12-01'
        },
        {
          userId: 1,
          userName: 'Zarelli',
          orderId: 123,
          productId: 111,
          productValue: 512.24,
          orderDate: '2021-12-01'
        },
        {
          userId: 1,
          userName: 'Zarelli',
          orderId: 123,
          productId: 122,
          productValue: 512.24,
          orderDate: '2021-12-01'
        },
        {
          userId: 2,
          userName: 'Medeiros',
          orderId: 12345,
          productId: 122,
          productValue: 256.24,
          orderDate: '2020-12-01'
        }
      ]
    });

    const allUsers = repository.getAllUsers();
    const allProducts = repository.getAllProducts();
    const allOrders = repository.getAllOrders();

    expect(allUsers.length).toBe(2);
    expect(allOrders.length).toBe(2);
    expect(allProducts.length).toBe(4);

    expect(allUsers).toEqual([
      { id: 1, name: 'Zarelli' },
      { id: 2, name: 'Medeiros' }
    ]);

    expect(allOrders).toEqual([
      { id: 123, date: '2021-12-01', userId: 1 },
      { id: 12345, date: '2020-12-01', userId: 2 }
    ]);

    expect(allProducts).toEqual([
      { id: 111, orderId: 123, value: 512.24 },
      { id: 122, orderId: 123, value: 512.24 },
      { id: 111, orderId: 12345, value: 256.24 },
      { id: 122, orderId: 12345, value: 256.24 }
    ]);
  });
});
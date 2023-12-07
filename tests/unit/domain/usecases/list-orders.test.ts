import { ListOrdersInput, ListOrdersOutput } from '../../../../src/domain/usecases/list-orders';

import { makeListOrdersUseCase } from '../../../utils/factories';

describe('ListOrders Use Case', () => {
  it('should return orders by order id', async () => {
    const usecase = makeListOrdersUseCase();
    
    const searchByOrderIdInput: ListOrdersInput = {
      orderId: 1,
      purchaseDateRange: undefined
    };
    
    const searchByOrderIdResult = await usecase.execute(searchByOrderIdInput);

    expect(searchByOrderIdResult.isRight()).toBe(true);

    const orders = (searchByOrderIdResult.value as ListOrdersOutput).orders;

    expect(orders.length).toBe(1);
    expect(orders[0].id).toBe(1);
    expect(orders[0].customer.id).toBe(1);
    expect(orders[0].customer.name).toBe('C1');
    expect(orders[0].date.toJSON()).toBe('2020-12-01T00:00:00.000Z');
    expect(orders[0].products.length).toBe(2);
    expect(orders[0].products[0].id).toBe(1);
    expect(orders[0].products[0].value).toBe(200);
    expect(orders[0].products[1].id).toBe(2);
    expect(orders[0].products[1].value).toBe(400);
    expect(orders[0].total).toBe(600);
  });

  it('should return orders by purchase date range', async () => {
    const usecase = makeListOrdersUseCase();

    const searchByPurchaseDateRangeInput: ListOrdersInput = {
      orderId: undefined,
      purchaseDateRange: {
        start: '2020-12-01',
        end: '2020-12-03'
      }
    };

    const searchByAnotherPurchaseDateRangeInput: ListOrdersInput = {
      orderId: undefined,
      purchaseDateRange: {
        start: '2021-12-01',
        end: '2021-12-03'
      }
    };

    const searchByPurchaseDateRangeResult = await usecase.execute(searchByPurchaseDateRangeInput);
    const searchByAnotherPurchaseDateRangeResult = await usecase.execute(searchByAnotherPurchaseDateRangeInput);

    expect(searchByPurchaseDateRangeResult.isRight()).toBeTruthy();
    expect(searchByAnotherPurchaseDateRangeResult.isRight()).toBeTruthy();

    const orders = (searchByPurchaseDateRangeResult.value as ListOrdersOutput).orders;
    const moreOrders = (searchByAnotherPurchaseDateRangeResult.value as ListOrdersOutput).orders;

    expect(orders.length).toBe(2);
    expect(orders[0].id).toBe(1);
    expect(orders[0].customer.id).toBe(1);
    expect(orders[0].customer.name).toBe('C1');
    expect(orders[0].date.toJSON()).toBe('2020-12-01T00:00:00.000Z');
    expect(orders[0].products.length).toBe(2);
    expect(orders[0].products[0].id).toBe(1);
    expect(orders[0].products[0].value).toBe(200);
    expect(orders[0].products[1].id).toBe(2);
    expect(orders[0].products[1].value).toBe(400);
    expect(orders[0].total).toBe(600);
    expect(orders[1].id).toBe(3);
    expect(orders[1].customer.id).toBe(1);
    expect(orders[1].customer.name).toBe('C1');
    expect(orders[1].date.toJSON()).toBe('2020-12-01T00:00:00.000Z');
    expect(orders[1].products.length).toBe(2);
    expect(orders[1].products[0].id).toBe(3);
    expect(orders[1].products[0].value).toBe(600);
    expect(orders[1].products[1].id).toBe(4);
    expect(orders[1].products[1].value).toBe(800);
    expect(orders[1].total).toBe(1400);

    expect(moreOrders.length).toBe(2);
    expect(moreOrders[0].id).toBe(2);
    expect(moreOrders[0].customer.id).toBe(2);
    expect(moreOrders[0].customer.name).toBe('C2');
    expect(moreOrders[0].date.toJSON()).toBe('2021-12-01T00:00:00.000Z');
    expect(moreOrders[0].products.length).toBe(2);
    expect(moreOrders[0].products[0].id).toBe(1);
    expect(moreOrders[0].products[0].value).toBe(200);
    expect(moreOrders[0].products[1].id).toBe(2);
    expect(moreOrders[0].products[1].value).toBe(400);
    expect(moreOrders[0].total).toBe(600);
    expect(moreOrders[1].id).toBe(4);
    expect(moreOrders[1].customer.id).toBe(2);
    expect(moreOrders[1].customer.name).toBe('C2');
    expect(moreOrders[1].date.toJSON()).toBe('2021-12-01T00:00:00.000Z');
    expect(moreOrders[1].products.length).toBe(2);
    expect(moreOrders[1].products[0].id).toBe(3);
    expect(moreOrders[1].products[0].value).toBe(600);
    expect(moreOrders[1].products[1].id).toBe(4);
    expect(moreOrders[1].products[1].value).toBe(800);
    expect(moreOrders[1].total).toBe(1400);
  });

  it('should return no orders by not available purchase date range', async () => {
    const usecase = makeListOrdersUseCase();

    const searchByNotAvailablePurchaseDateRangeInput: ListOrdersInput = {
      orderId: undefined,
      purchaseDateRange: {
        start: '2022-12-01',
        end: '2022-12-03'
      }
    };

    const searchByNotAvailablePurchaseDateRangeResult = await usecase.execute(searchByNotAvailablePurchaseDateRangeInput);

    expect(searchByNotAvailablePurchaseDateRangeResult.isRight()).toBeTruthy();

    const orders = (searchByNotAvailablePurchaseDateRangeResult.value as ListOrdersOutput).orders;

    expect(orders.length).toBe(0);
  });

  it('should return all orders', async () => {
    const usecase = makeListOrdersUseCase();

    const searchByNoCriteriaInput: ListOrdersInput = {
      orderId: undefined,
      purchaseDateRange: undefined
    };

    const searchByNoCriteriaResult = await usecase.execute(searchByNoCriteriaInput);

    expect(searchByNoCriteriaResult.isRight()).toBeTruthy();

    const orders = (searchByNoCriteriaResult.value as ListOrdersOutput).orders;

    expect(orders.length).toBe(4);
  });
});
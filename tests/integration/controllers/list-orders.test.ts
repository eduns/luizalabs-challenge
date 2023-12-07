import { makeListOrdersController } from '../../utils/factories';

describe('ListOrders Controller', () => {
  it('should return orders without any parameter', async () => {
    const controller = makeListOrdersController();
    
    const result = await controller.handle({});
    
    expect(result.statusCode).toBe(200);
    expect(result.body.orders.length).toBeGreaterThan(0);
  });

  it('should return orders with the orderId parameter', async () => {
    const controller = makeListOrdersController();
    
    const result = await controller.handle({ orderId: '3' });
    
    expect(result.statusCode).toBe(200);
    expect(result.body.orders.length).toBe(1);
  });

  it('should return orders with the purchaseDateRangeStart and purchaseDateRangeEnd', async () => {
    const controller = makeListOrdersController();
    
    const result = await controller.handle({
      purchaseDateRangeStart: '2021-12-01',
      purchaseDateRangeEnd: '2021-12-02'
    });
    
    expect(result.statusCode).toBe(200);
    expect(result.body.orders.length).toBe(2);
  });

  it('should return an error if orderId parameter is invalid', async () => {
    const controller = makeListOrdersController();
    
    const result = await controller.handle({ orderId: '' });
    
    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('Param orderId should be a valid number');
  });

  it('should return an error if purchaseDateRangeStart or purchaseDateRangeEnd is present, but not both', async () => {
    const controller = makeListOrdersController();
    
    const result = await controller.handle({ purchaseDateRangeStart: '2021-12-01' });
    
    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('Param purchaseDateRangeStart and purchaseDateRangeEnd should be present');
  });

  it('should return an error if purchaseDateRangeStart or purchaseDateRangeEnd are invalid', async () => {
    const controller = makeListOrdersController();
    
    let result = await controller.handle({
      purchaseDateRangeStart: 'x',
      purchaseDateRangeEnd: '2021-12-01',
    });
    
    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('Param purchaseDateRangeStart should be a valid date');
    
    result = await controller.handle({
      purchaseDateRangeStart: '2021-12-01',
      purchaseDateRangeEnd: 'x',
    });
    
    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('Param purchaseDateRangeEnd should be a valid date');
  });
});
import { ListOrdersOutput } from '../../domain/usecases/list-orders';

import { ControllerResponse } from '../responses';

type ListOrdersPresenterOutput = {
  user_id: number;
  name: string;
  orders: {
    order_id: number;
    total: string;
    date: string;
    products: {
      product_id: number;
      value: string;
    }[];
  }[];
}

const errorMessages = {
  400: 'Bad Request',
  500: 'Server Error'
};

export default class ListOrdersPresenter {
  public static render (response: ControllerResponse): any {
    return response.statusCode !== 200 ? { message: response.body.message || errorMessages[response.statusCode] } :
      transformResult(response.body);
  }
}

function transformResult (result: ListOrdersOutput): ListOrdersPresenterOutput[] {
  const users: any = {};

  result.orders.forEach(order => {
    if (!users[order.customer.id])
      users[order.customer.id] = {
        user_id: order.customer.id,
        name: order.customer.name,
        orders: []
      };

    users[order.customer.id]['orders'].push({
      order_id: order.id,
      total: String(order.total.toFixed(2)),
      products: order.products.map(product => ({
        product_id: product.id,
        value: String(product.value)
      }))
    });
  });

  return Object.values(users);
}
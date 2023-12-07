import LegacyDataRepository from '../interfaces/repositories/LegacyDataRepository';

import { Either, right } from '../interfaces/either';

type ProductData = {
  id: number;
  value: number;
  orderId: number;
}

type OrderData = {
  id: number;
  products: ProductData[];
  date: string;
  userId: number;
}

type CustomerData = {
  id: number;
  name: string;
}

export type ImportDataInput = {
  data: {
    userId: number;
    userName: string;
    orderId: number;
    orderDate: string;
    productId: number;
    productValue: number;
  }[];
}

export default class ImportData {
  constructor (
    private readonly legacyDataRepository: LegacyDataRepository
  ) {}

  async execute (input: ImportDataInput): Promise<Either<Error, {
    userId: number;
    userName: string;
    orderId: number;
    orderDate: string;
    productId: number;
    productValue: number;
  }[]>> {
    const orderData:any = {}, userData:any = {};

    input.data.forEach(data => {
      if (!orderData[data.orderId]) {
        orderData[data.orderId] = {
          id: data.orderId,
          products: [] as ProductData[],
          date: data.orderDate,
          userId: data.userId
        };
      }

      if (!userData[data.userId]) {
        userData[data.userId] = {
          id: data.userId,
          name: data.userName
        };
      }

      orderData[data.orderId]['products'].push({
        id: data.productId,
        value: data.productValue,
        userId: data.userId
      });
    });

    const orders: OrderData[] = [];
    const users: CustomerData[] = [];
    const products: ProductData[] = [];

    Object.entries(orderData).forEach((v) => {
      const od = v[1] as OrderData;
      const orderId = od.id;
      const orderProducts = od.products;
      const userId = od.userId;
      const orderDate = od.date;

      orders.push({ id: orderId, products: orderProducts, date: orderDate, userId });

      orderProducts.forEach(op => { 
        products.push({ id: op.id, value: op.value, orderId });
      });
    });

    Object.entries(userData).forEach(v => {
      const ud = v[1] as CustomerData;
      users.push({ id: ud.id, name: ud.name });
    });

    await this.legacyDataRepository.save({ 
      users, products, orders: orders.map(({ id, date, userId }) => ({ id, date, userId }))
    });

    return right(input.data);
  }
}
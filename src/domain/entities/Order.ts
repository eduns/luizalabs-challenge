import Product from './Product';
import Customer from './Customer';

export default class Order {
  constructor (
    public readonly id: number,
    public readonly customer: Customer,
    public readonly date: Date,
    public readonly products: Product[]
  ) {}

  public get total(): number {
    return this.products.reduce((pv, p) => pv + p.value, 0);
  }
}
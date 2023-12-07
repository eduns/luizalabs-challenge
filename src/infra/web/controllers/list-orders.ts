import ListOrders, { ListOrdersInput } from '../../../domain/usecases/list-orders';

import { ControllerResponse, ok, badRequest } from '../../../presentation/responses';

import ParamsValidator from '../../interfaces/ParamsValidator';

export default class ListOrdersController {
  constructor (
    private readonly usecase: ListOrders,
    private readonly paramsValidator: ParamsValidator
  ) {}

  async handle (params: any): Promise<ControllerResponse> {
    const { error } = this.paramsValidator.validate(params);
    
    if (error) {
      return badRequest(error);
    }

    const orderId = params['orderId'];
    const purchaseDateRangeStart = params['purchaseDateRangeStart'];
    const purchaseDateRangeEnd = params['purchaseDateRangeEnd'];

    const input: ListOrdersInput = {
      orderId: Number(orderId) || undefined,
      purchaseDateRange: purchaseDateRangeStart && purchaseDateRangeEnd ? {
        start: purchaseDateRangeStart as string,
        end: purchaseDateRangeEnd as string
      } : undefined
    };

    const result = await this.usecase.execute(input);

    if (result.isLeft()) {
      return badRequest(result.value);
    }

    return ok(result.value);
  }
}

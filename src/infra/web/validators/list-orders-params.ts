import validator from 'validator';

import ParamsValidator from '../../interfaces/ParamsValidator';

import InvalidParamsError from '../../../presentation/errors/invalid-params';

const dateRegex = /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;

export default class ListOrdersParamsValidator implements ParamsValidator {
  validate (params: {
    orderId: any,
    purchaseDateRangeStart: any,
    purchaseDateRangeEnd: any
  }): { error: Error | undefined } {
    if (params.orderId !== undefined) {
      if (validator.isEmpty(params.orderId) || Number.isNaN(Number(params.orderId))) {
        return { error: new InvalidParamsError('orderId', 'should be a valid number') };
      }
    }

    if (params.purchaseDateRangeStart !== undefined && params.purchaseDateRangeEnd !== undefined) {
      if (validator.isEmpty(params.purchaseDateRangeStart) || !dateRegex.test(params.purchaseDateRangeStart)) {
        return { error: new InvalidParamsError('purchaseDateRangeStart', 'should be a valid date') };
      }

      if (validator.isEmpty(params.purchaseDateRangeEnd) || !dateRegex.test(params.purchaseDateRangeEnd)) {
        return { error: new InvalidParamsError('purchaseDateRangeEnd', 'should be a valid date') };
      }
    } else if (params.purchaseDateRangeStart !== undefined || params.purchaseDateRangeEnd) {
      return { error: new InvalidParamsError('purchaseDateRangeStart and purchaseDateRangeEnd', 'should be present')};
    }

    return { error: undefined };
  }
}
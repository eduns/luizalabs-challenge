import ParamsValidator from '../../interfaces/ParamsValidator';

import RequiredParams from '../../../presentation/errors/required-params';

export default class ImportDataParamsValidator implements ParamsValidator {
  validate (params: { file: any }): { error: Error | undefined } {

    if (!params.file) {
      return { error : new RequiredParams('file') };
    }

    return { error : undefined };
  }
}
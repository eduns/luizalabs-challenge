import { unlink } from 'fs/promises';

import ImportData, { ImportDataInput } from '../../../domain/usecases/import-data';

import FileProcessorStream from '../../file-processor/file-processor';

import { ControllerResponse, ok, badRequest, serverError } from '../../../presentation/responses';

import ParamsValidator from '../../interfaces/ParamsValidator';

const fileProcessor = new FileProcessorStream();

export default class ImportDataController {
  constructor (
    private readonly usecase: ImportData,
    private readonly paramsValidator: ParamsValidator
  ) {}

  async handle (params: { file: any }): Promise<ControllerResponse> {
    const { error } = this.paramsValidator.validate(params);

    if (error) {
      return badRequest(error);
    }

    try {
      const fileData = await fileProcessor.processFile(params.file);

      await unlink(params.file);
      
      const input: ImportDataInput = {
        data: fileData
      };

      const result = await this.usecase.execute(input);

      return ok(result.value);
    } catch (error: any) {
      return serverError(error);
    }
  }
}

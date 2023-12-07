import { ControllerResponse } from '../responses';

const statusMessages = {
  200: 'Successful Upload',
  500: 'Server Error',
  400: 'Bad Request'
};

export default class ImportDataPresenter {
  public static render (response: ControllerResponse): { message: string } {
    return {
      message: response.statusCode !== 200 ? response.body.message : statusMessages[response.statusCode]
    };
  }
}
export default class RequiredParamsError extends Error {
  constructor (paramName: string) {
    super(`Param ${paramName} is required`);
  }
}
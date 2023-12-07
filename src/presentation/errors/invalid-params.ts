export default class InvalidParamsError extends Error {
  constructor (paramName: string, reason?: string) {
    const message = reason || 'is invalid';
    super(`Param ${paramName} ${message}`);
  }
}
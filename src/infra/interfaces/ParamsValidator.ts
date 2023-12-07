interface ParamsValidator {
  validate (params: any): { error: Error | undefined };
}

export default ParamsValidator;
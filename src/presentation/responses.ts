export type ControllerResponse = {
  statusCode: number;
  body: any;
};

export const ok = (data: any): ControllerResponse => ({
  statusCode: 200,
  body: data
});

export const badRequest = (error: Error): ControllerResponse => ({
  statusCode: 400,
  body: error
});

export const serverError = (error: Error): ControllerResponse => ({
  statusCode: 500,
  body: error
});
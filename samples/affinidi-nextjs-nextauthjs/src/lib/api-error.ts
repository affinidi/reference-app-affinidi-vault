export class ApiError extends Error {
  readonly code: string;
  readonly context: any;
  readonly httpStatusCode: number;

  constructor(input: {
    code: string;
    httpStatusCode?: number;
    message?: string;
    context?: any;
  }) {
    super(input.message);
    this.code = input.code;
    this.context = input.context;
    this.httpStatusCode = input.httpStatusCode ?? 400;
  }
}

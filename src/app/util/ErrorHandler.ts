class ErrorHandler extends Error {
  status: number;
  constructor(status: number = 500, ...params: string[]) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorHandler);
    }

    this.status = status;
  }
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof ErrorHandler) return error.message;
  return String(error);
};

const getErrorStatusCode = (error: unknown) => {
  if (error instanceof ErrorHandler) return error.status;
  return 500;
};
export { ErrorHandler, getErrorMessage, getErrorStatusCode };

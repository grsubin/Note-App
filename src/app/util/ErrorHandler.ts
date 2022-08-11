class ErrorHandler extends Error {
  status: Number;
  constructor(status: Number = 500, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorHandler);
    }

    this.status = status;
  }
}

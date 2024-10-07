class ApiError extends Error {
  constructor(statusCode, message = "Server Error", errorDetails = null) {
    super(message);
    this.name = "ApiError";
    this.success = false;
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    Error.captureStackTrace(this, ApiError);
  }
  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      errorDetails: this.errorDetails,
      message: this.message,
      stack: this.stack,
    };
  }
}

export default ApiError;

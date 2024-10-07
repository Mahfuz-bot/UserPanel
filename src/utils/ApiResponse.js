class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.name = "ApiResponse";
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };
  }
}

export default ApiResponse;

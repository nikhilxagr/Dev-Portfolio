export function errorHandler(error, _request, response, _next) {
  const statusCode = error.statusCode ?? 500;

  response.status(statusCode).json({
    message:
      statusCode >= 500
        ? "Something went wrong on the server."
        : error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
}

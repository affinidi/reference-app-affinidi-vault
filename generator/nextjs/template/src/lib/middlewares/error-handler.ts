import { Middleware } from "next-api-middleware";
import { ApiError } from "src/lib/api-error";

export const errorHandler: Middleware = async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.httpStatusCode).json({
        error: {
          code: error.code,
          message: error.message,
          context: error.context,
        },
      });
    } else {
      console.error("Unhandled error:", error);
      res.status(500).json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }
};

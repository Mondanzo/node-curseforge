
/**
 * Error getting thrown if the requested resource could not be found.
 */
export class ErrorNotFound extends Error { name = "Not Found"; message = "The requested resource could not be found."; code = 404 }
/**
 * Error getting thrown if the request contains a malformed request body.
 */
export class ErrorBadRequest extends Error { name = "Bad Request"; message = "The request is malformed and won't be processed."; code = 400 }

/**
 * Error getting thrown if the server processing request throws an error. This is not a client error.
 */
export class ErrorInternalServer extends Error { name = "Internal Server Error"; message = "Something on the server happened that made it impossible to resolve the request."; code = 500 }

/**
 * Error getting thrown if the service isn't available at the current time.
 */
export class ErrorServiceUnavailable extends Error { name = "Service Unavailable"; message = "The service currently is not available."; code = 503 }
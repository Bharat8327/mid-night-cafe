const Status = {
  // 2xx: Success
  OK: 200, // Standard successful request
  CREATED: 201, // Resource created
  ACCEPTED: 202, // Request accepted (async)
  NO_CONTENT: 204, // Success but no content to return

  // 3xx: Redirection
  MOVED_PERMANENTLY: 301, // URL moved permanently
  FOUND: 302, // Temporary redirect
  NOT_MODIFIED: 304, // Cache still valid

  // 4xx: Client Errors
  BAD_REQUEST: 400, // Invalid client request
  UNAUTHORIZED: 401, // Authentication required
  FORBIDDEN: 403, // Authenticated but access denied
  NOT_FOUND: 404, // Resource not found
  METHOD_NOT_ALLOWED: 405, // Invalid method for route
  CONFLICT: 409, // Conflict (e.g., duplicate entry)
  UNPROCESSABLE_ENTITY: 422, // Validation error
  TOO_MANY_REQUESTS: 429, // Rate limiting

  // 5xx: Server Errors
  INTERNAL_SERVER_ERROR: 500, // Generic server error
  BAD_GATEWAY: 502, // Invalid response from upstream
  SERVICE_UNAVAILABLE: 503, // Server overloaded or down
  GATEWAY_TIMEOUT: 504, // Upstream server timeout
};

export default Status;

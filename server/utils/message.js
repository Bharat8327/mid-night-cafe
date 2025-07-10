const message = {
  // ✅ 2xx: Success
  200: 'OK',
  201: 'Resource created successfully',
  202: 'Request accepted',
  204: 'No content',

  // 🔁 3xx: Redirection
  301: 'Resource moved permanently',
  302: 'Resource found at a different URL',
  304: 'Resource not modified',

  // ❗ 4xx: Client Errors
  400: 'All fields are required',
  401: 'Unauthorized access',
  403: 'Access forbidden',
  404: 'Resource not found',
  405: 'Method not allowed',
  409: 'Conflict occurred',
  422: 'Validation failed',
  429: 'Too many requests',

  // 🛑 5xx: Server Errors
  500: 'Internal server error',
  502: 'Bad gateway',
  503: 'Service unavailable',
  504: 'Gateway timeout',
};

export default message;

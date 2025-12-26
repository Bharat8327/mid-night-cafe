const handleOtpError = (res, error) => {
  switch (error.message) {
    case 'OTP_NOT_FOUND':
      return errorResponse(res, Status.BAD_REQUEST, 'OTP not found');

    case 'OTP_EXPIRED':
      return errorResponse(res, Status.BAD_REQUEST, 'OTP expired');

    case 'INVALID_OTP':
      return errorResponse(res, Status.BAD_REQUEST, 'Invalid OTP');

    case 'TOO_MANY_ATTEMPTS':
      return errorResponse(res, Status.TOO_MANY_REQUESTS, 'Too many attempts');

    default:
      console.error('OTP Error:', error);
      return errorResponse(
        res,
        Status.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
      );
  }
};

export default handleOtpError;

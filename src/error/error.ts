import { HttpException, HttpStatus } from '@nestjs/common';

const resolveError = (error: any) => {
  if (error.code === 'ECONNREFUSED') {
    throw new HttpException(
      'Database connection refused',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  } else if (error instanceof HttpException) {
    throw error;
  } else if (error.message) {
    throw new HttpException(
      error.send(`{
        "code": ${HttpStatus.BAD_REQUEST},
        "success": false,
        "message": "BAD REQUEST"
      }`),
      HttpStatus.BAD_REQUEST,
    );
  } else if (error.code === 'ER_DUP_ENTRY') {
    throw new HttpException(
      {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'CONFLICT DATA',
      },
      HttpStatus.CONFLICT,
    );
  } else {
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
export { resolveError };

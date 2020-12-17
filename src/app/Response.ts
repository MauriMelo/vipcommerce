interface IResponse {
  status: number;
  data: any;
  message?: string;
}
export default class BaseController {
  static NOT_FOUND = 404;

  static OK = 200;

  static INTERNAL_SERVER_ERROR = 500;

  static response(status: number, data: any, message?: string): IResponse {
    return {
      status,
      data,
      message,
    };
  }

  static errorResponse(
    status: number = 500,
    error: string = 'Erro interno no servidor',
    data?: any
  ): IResponse {
    return {
      status,
      data,
      message: error,
    };
  }
}

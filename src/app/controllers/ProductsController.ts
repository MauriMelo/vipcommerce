import { Request, Response as ResponseExpress } from 'express';
import Response from '../Response';
import ProductsRepository from '../repositories/ProductsRepository';
import ProductsException from '../repositories/ProductsException';

export default class ProductsController {
  static async index(request: Request, response: ResponseExpress) {
    try {
      const products = await ProductsRepository.findAll();
      return response.json(Response.response(Response.OK, products));
    } catch (err) {
      if (err instanceof ProductsException) {
        return response
          .status(err.code)
          .json(Response.errorResponse(err.code, err.message));
      }
      return response
        .status(Response.INTERNAL_SERVER_ERROR)
        .json(Response.errorResponse());
    }
  }

  static show(request: Request, response: ResponseExpress) {
    return response.json({});
  }

  static create(request: Request, response: ResponseExpress) {
    return response.json({});
  }

  static update(request: Request, response: ResponseExpress) {
    return response.json({});
  }

  static delete(request: Request, response: ResponseExpress) {
    return response.json({});
  }
}

import { Request, Response as ResponseExpress } from 'express';
import * as Yup from 'yup';
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

  static async show(request: Request, response: ResponseExpress) {
    const { id } = request.params;
    try {
      const product = await ProductsRepository.find(parseInt(id, 10));
      return response.json(Response.response(Response.OK, product));
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

  static async create(request: Request, response: ResponseExpress) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      cor: Yup.string(),
      tamanho: Yup.string(),
      valor: Yup.number().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (err) {
      return response.json(
        Response.errorResponse(
          Response.BAD_REQUEST,
          'Requisição inválida',
          err.message
        )
      );
    }

    try {
      const product = await ProductsRepository.create(request.body);
      return response.json(Response.response(Response.OK, product));
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

  static async update(request: Request, response: ResponseExpress) {
    const { id } = request.params;

    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      cor: Yup.string(),
      tamanho: Yup.string(),
      valor: Yup.number().required(),
    });

    try {
      await schema.validate(request.body);
    } catch (err) {
      return response.json(
        Response.errorResponse(
          Response.BAD_REQUEST,
          'Requisição inválida',
          err.message
        )
      );
    }

    try {
      const product = await ProductsRepository.update(
        parseInt(id, 10),
        request.body
      );
      return response.json(Response.response(Response.OK, product));
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

  static async delete(request: Request, response: ResponseExpress) {
    const { id } = request.params;

    try {
      const isDelete = await ProductsRepository.delete(parseInt(id, 10));
      return response.json(Response.response(Response.OK, isDelete));
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
}

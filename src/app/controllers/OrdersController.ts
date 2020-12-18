import * as Yup from 'yup';
import { Request, Response as ResponseExpress } from 'express';
import Response from '../Response';
import OrdersRepository from '../repositories/Orders/OrdersRepository';
import OrdersException from '../repositories/Orders/OrdersException';
import CustomersException from '../repositories/Customers/CustomersException';

export default class OrdersController {
  static async index(request: Request, response: ResponseExpress) {
    try {
      const orders = await OrdersRepository.findAll();
      return response.json(Response.response(Response.OK, orders));
    } catch (err) {
      if (err instanceof OrdersException) {
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
      const order = await OrdersRepository.find(parseInt(id, 10));
      return response.json(Response.response(Response.OK, order));
    } catch (err) {
      if (err instanceof OrdersException) {
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
      id_cliente: Yup.number().required(),
      data: Yup.date().required(),
      observacao: Yup.string(),
      items: Yup.array()
        .of(
          Yup.object().shape({
            id_produto: Yup.number().required(),
            quantidade: Yup.number().required().min(1),
          })
        )
        .min(1)
        .required(),
      forma_pagamento: Yup.number().test(
        'oneOfRequired',
        '1 or 2 or 3 must be entered in forma_pagamento',
        (number) => number === 1 || number === 2 || number === 3
      ),
    });

    try {
      await schema.validate(request.body);
    } catch (err) {
      return response
        .status(Response.BAD_REQUEST)
        .json(
          Response.errorResponse(
            Response.BAD_REQUEST,
            'Requisição inválida',
            err.message
          )
        );
    }

    try {
      const order = await OrdersRepository.create(request.body);
      return response.json(Response.response(Response.OK, order));
    } catch (err) {
      if (err instanceof OrdersException || err instanceof CustomersException) {
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
    const schema = Yup.object().shape({
      id_cliente: Yup.number(),
      data: Yup.date(),
      observacao: Yup.string(),
      items: Yup.array()
        .of(
          Yup.object().shape({
            id_produto: Yup.number().required(),
            quantidade: Yup.number().required().min(1),
          })
        )
        .min(1),
      forma_pagamento: Yup.number()
        .nullable()
        .test(
          'oneOfRequired',
          '1 or 2 or 3 must be entered in forma_pagamento',
          (number) => number === 1 || number === 2 || number === 3
        ),
    });

    try {
      await schema.validate(request.body);
    } catch (err) {
      return response
        .status(Response.BAD_REQUEST)
        .json(
          Response.errorResponse(
            Response.BAD_REQUEST,
            'Requisição inválida',
            err.message
          )
        );
    }

    const { id } = request.params;

    try {
      const order = await OrdersRepository.update(
        parseInt(id, 10),
        request.body
      );
      return response.json(Response.response(Response.OK, order));
    } catch (err) {
      if (err instanceof OrdersException || err instanceof CustomersException) {
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
      const isDelete = await OrdersRepository.delete(parseInt(id, 10));
      return response.json(Response.response(Response.OK, isDelete));
    } catch (err) {
      if (err instanceof OrdersException) {
        return response
          .status(err.code)
          .json(Response.errorResponse(err.code, err.message));
      }
      return response
        .status(Response.INTERNAL_SERVER_ERROR)
        .json(Response.errorResponse());
    }
  }

  static async email(request: Request, response: ResponseExpress) {
    return response.json({});
  }

  static async report(request: Request, response: ResponseExpress) {
    return response.json({});
  }
}

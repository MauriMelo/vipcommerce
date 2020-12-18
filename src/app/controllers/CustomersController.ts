import * as Yup from 'yup';
import { Request, Response as ResponseExpress } from 'express';
import Response from '../Response';
import CustomersRepository from '../repositories/Customers/CustomersRepository';
import CustomersException from '../repositories/Customers/CustomersException';

export default class CustomersController {
  static async index(request: Request, response: ResponseExpress) {
    try {
      const customers = await CustomersRepository.findAll();
      return response.json(Response.response(Response.OK, customers));
    } catch (err) {
      if (err instanceof CustomersException) {
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
      const customer = await CustomersRepository.find(parseInt(id, 10));
      return response.json(Response.response(Response.OK, customer));
    } catch (err) {
      if (err instanceof CustomersException) {
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
      cpf: Yup.string().min(11).max(11).required(),
      sexo: Yup.string().max(1),
      email: Yup.string(),
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
      const customer = await CustomersRepository.create(request.body);
      return response.json(Response.response(Response.OK, customer));
    } catch (err) {
      if (err instanceof CustomersException) {
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
      nome: Yup.string(),
      cpf: Yup.string().min(11).max(11),
      sexo: Yup.string().max(1),
      email: Yup.string(),
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
      const customer = await CustomersRepository.update(
        parseInt(id, 10),
        request.body
      );
      return response.json(Response.response(Response.OK, customer));
    } catch (err) {
      if (err instanceof CustomersException) {
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
      const isDelete = await CustomersRepository.delete(parseInt(id, 10));
      return response.json(Response.response(Response.OK, isDelete));
    } catch (err) {
      if (err instanceof CustomersException) {
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

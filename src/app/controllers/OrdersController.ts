import * as Yup from 'yup';
import { Request, Response as ResponseExpress } from 'express';
import moment from 'moment';
import Mail from '../libs/Mail';
import Response from '../Response';
import OrdersRepository from '../repositories/Orders/OrdersRepository';
import OrdersException from '../repositories/Orders/OrdersException';
import CustomersException from '../repositories/Customers/CustomersException';
import config from '../../config/app';

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
    const { id } = request.params;
    let order;
    try {
      order = (await OrdersRepository.find(parseInt(id, 10))) as any;
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

    let pagamento;
    if (order.forma_pagamento === 1) {
      pagamento = 'dinheiro';
    } else if (order.forma_pagamento === 2) {
      pagamento = 'cartão';
    } else {
      pagamento = 'cheque';
    }

    try {
      await Mail.sendMail({
        to: `${order.customer.nome} <${order.customer.email}>`,
        subject: 'Novo pedido criado',
        template: 'order',
        context: {
          order: {
            forma_pagamento: pagamento,
            data: moment(order.data).format('DD/MM/YYYY'),
            observacao: order.observacao,
          },
          items: order.items.map((i: any) => ({
            nome: i.product.nome,
            valor: i.product.valor.toLocaleString(),
            quantidade: i.quantidade,
          })),
          customer: {
            nome: order.customer.nome,
            sexo: order.customer.sexo === 'm' ? 'Masculino' : 'Feminino',
            cpf: order.customer.cpf,
            email: order.customer.email,
          },
          total: order.items
            .reduce(
              (total: number, i: any) => total + i.product.valor * i.quantidade,
              0
            )
            .toLocaleString(),
        },
      });
      return response.json(
        Response.response(Response.OK, 'Novo pedido enviado por email')
      );
    } catch (err) {
      return response
        .status(Response.INTERNAL_SERVER_ERROR)
        .json(Response.errorResponse());
    }
  }

  static async report(request: Request, response: ResponseExpress) {
    const { id } = request.params;
    let order;
    try {
      order = (await OrdersRepository.find(parseInt(id, 10))) as any;
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

    if (order.forma_pagamento === 1) {
      order.pagamento = 'dinheiro';
    } else if (order.forma_pagamento === 2) {
      order.pagamento = 'cartão';
    } else {
      order.pagamento = 'cheque';
    }

    OrdersRepository.pdfGererate(order);
    return response.json({
      data: {
        link: `${config.hostname}/public/pdf.pdf`,
      },
    });
  }
}

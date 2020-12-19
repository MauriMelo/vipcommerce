import { Router } from 'express';
import CustomersController from './controllers/CustomersController';
import OrdersController from './controllers/OrdersController';
import ProductsController from './controllers/ProductsController';

const router = Router();

router.get('/clientes', CustomersController.index);
router.get('/clientes/:id', CustomersController.show);
router.post('/clientes/', CustomersController.create);
router.put('/clientes/:id', CustomersController.update);
router.delete('/clientes/:id', CustomersController.delete);

router.get('/produtos', ProductsController.index);
router.get('/produtos/:id', ProductsController.show);
router.post('/produtos/', ProductsController.create);
router.put('/produtos/:id', ProductsController.update);
router.delete('/produtos/:id', ProductsController.delete);

router.get('/pedidos', OrdersController.index);
router.get('/pedidos/:id', OrdersController.show);
router.post('/pedidos/', OrdersController.create);
router.put('/pedidos/:id', OrdersController.update);
router.delete('/pedidos/:id', OrdersController.delete);

router.post('/pedidos/:id/sendmail', OrdersController.email);
router.get('/pedidos/:id/report', OrdersController.report);

export default router;

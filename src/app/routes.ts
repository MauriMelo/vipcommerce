import { Router } from 'express';
import ClientesController from './controllers/ClientesController';
import PedidosController from './controllers/PedidosController';
import ProdutosController from './controllers/ProdutosController';

const router = Router();

router.get('/clientes', ClientesController.index);
router.get('/clientes/:id', ClientesController.show);
router.post('/clientes/', ClientesController.create);
router.put('/clientes/:id', ClientesController.update);
router.delete('/clientes/:id', ClientesController.delete);

router.get('/produtos', ProdutosController.index);
router.get('/produtos/:id', ProdutosController.show);
router.post('/produtos/', ProdutosController.create);
router.put('/produtos/:id', ProdutosController.update);
router.delete('/produtos/:id', ProdutosController.delete);

router.get('/pedidos', PedidosController.index);
router.get('/pedidos/:id', PedidosController.show);
router.post('/pedidos/', PedidosController.create);
router.put('/pedidos/:id', PedidosController.update);
router.delete('/pedidos/:id', PedidosController.delete);

export default router;

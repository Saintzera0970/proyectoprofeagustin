import { Router } from "express" ;
import {productsRouter} from './modules/productos/router/product_router.js'
import {VentasRouter} from './modules/ventas/router/router.js'
export const router = Router();

router.use('/productos', productsRouter);
router.use('/ventas', VentasRouter);


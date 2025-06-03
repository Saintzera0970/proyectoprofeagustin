import { Router } from "express" ;
import {productsRouter} from './modules/productos/router/product_router.js'
import {VentasRouter} from './modules/ventas/router/router.js'
import { ruta } from "./modules/clientes/router/indexRoutes.js";
import { rutaEmpleado } from './modules/empleados/router/indexRouter.js';

export const router = Router();

router.use('/productos', productsRouter);
router.use('/ventas', VentasRouter);
router.use('/clientes',ruta)
router.use('/empleados', rutaEmpleado); 


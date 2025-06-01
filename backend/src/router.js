import { Router } from "express" ;
import { productsHandler } from "./productos/router/product_router.js";
import { VentasRouter } from "./ventas/router/router.js";
export const router = Router();

router.use('/productos', productsHandler);
router.use('/ventas', VentasRouter);


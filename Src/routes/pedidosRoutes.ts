import { Router } from "express";
import { createPedido, listPedidos, concluirPedido } from "../controllers/pedidosController.ts";
import { auth} from "../middlleware/auth.ts";

const pedidosRouter = Router();


pedidosRouter.post("/", auth, createPedido);


pedidosRouter.get("/", auth, listPedidos);


pedidosRouter.put("/:id/concluir", auth, concluirPedido);

export default pedidosRouter;

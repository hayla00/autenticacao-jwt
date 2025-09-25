import { Router } from "express";
import {
  createProduto,
  listProdutos,
  getProduto,
  updateProduto,
  deleteProduto,
} from "../controllers/produtoController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/produtos", auth, createProduto);
router.get("/produtos", auth, listProdutos);
router.get("/produtos/:id", auth, getProduto);
router.put("/produtos/:id", auth, updateProduto);
router.delete("/produtos/:id", auth, deleteProduto);

export default router;

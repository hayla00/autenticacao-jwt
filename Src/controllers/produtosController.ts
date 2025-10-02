import type { Response } from "express";
import { prismaClient } from "../../prisma/prisma.ts";
import type { AuthRequest } from "../middlleware/auth.ts"; // se usou a interface acima

export async function createProduto(req: AuthRequest, res: Response) {
  try {
    const { nome, descricao, preco, estoque, status } = req.body;
    const userPayload = req.user;
    if (!userPayload) return res.status(401).json({ error: "unauthenticated" });

    const userId = userPayload.id ?? userPayload.userId ?? userPayload.sub; 

    const produto = await prismaClient.produto.create({
      data: {
        nome,
        descricao,
        preco: preco, 
        estoque: Number(estoque),
        status: status ?? "Disponivel",
        userId: Number(userId),
      },
    });

    return res.status(201).json(produto);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Erro ao criar produto", details: err });
  }
}

export async function listProdutos(req: AuthRequest, res: Response) {
  try {
    const produtos = await prismaClient.produto.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao listar produtos" });
  }
}

export async function getProduto(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const produto = await prismaClient.produto.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
    return res.json(produto);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar produto" });
  }
}

export async function updateProduto(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, status } = req.body;
    const userPayload = req.user;
    const userId = userPayload?.id ?? userPayload?.userId ?? userPayload?.sub;

    const produto = await prismaClient.produto.findUnique({ where: { id } });
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });

    if (Number(produto.userId) !== Number(userId))
      return res.status(403).json({ error: "Você não tem permissão para editar este produto" });

    const updated = await prismaClient.produto.update({
      where: { id },
      data: {
        nome,
        descricao,
        preco,
        estoque: estoque !== undefined ? Number(estoque) : produto.estoque,
        status,
      },
    });

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: "Erro ao atualizar produto", details: err });
  }
}

export async function deleteProduto(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userPayload = req.user;
    const userId = userPayload?.id ?? userPayload?.userId ?? userPayload?.sub;

    const produto = await prismaClient.produto.findUnique({ where: { id } });
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });

    if (Number(produto.userId) !== Number(userId))
      return res.status(403).json({ error: "Você não tem permissão para remover este produto" });

    await prismaClient.produto.delete({ where: { id } });

    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ error: "Erro ao deletar produto", details: err });
  }
}

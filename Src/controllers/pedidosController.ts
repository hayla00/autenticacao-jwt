import type { Response } from "express";
import { prismaClient } from "../../prisma/prisma.ts";
import type { AuthRequest } from "../middlleware/auth.ts";


export async function createPedido(req: AuthRequest, res: Response) {
  try {
    const { produtos } = req.body; 
    const userPayload = req.user;
    if (!userPayload) return res.status(401).json({ error: "unauthenticated" });

    const userId = userPayload.id ?? userPayload.userId ?? userPayload.sub;

  
    const pedido = await prismaClient.pedido.create({
      data: {
        userId: Number(userId),
        produtos: {
          create: produtos.map((produtoId: string) => ({
            produto: { connect: { id: produtoId } }
          }))
        }
      },
      include: {
        produtos: { include: { produto: true } }
      }
    });

    return res.status(201).json(pedido);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Erro ao criar pedido", details: err });
  }
}


export async function listPedidos(req: AuthRequest, res: Response) {
  try {
    const userPayload = req.user;
    if (!userPayload) return res.status(401).json({ error: "unauthenticated" });

    const userId = userPayload.id ?? userPayload.userId ?? userPayload.sub;

    const pedidos = await prismaClient.pedido.findMany({
      where: { userId: Number(userId) },
      include: {
        produtos: {
          include: {
            produto: true
          }
        }
      }
    });

    return res.json(pedidos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar pedidos" });
  }
}


export async function concluirPedido(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userPayload = req.user;
    if (!userPayload) return res.status(401).json({ error: "unauthenticated" });

    const userId = userPayload.id ?? userPayload.userId ?? userPayload.sub;

    
    const pedido = await prismaClient.pedido.findUnique({
      where: { id: Number(id) }
    });

    if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });
    if (Number(pedido.userId) !== Number(userId))
      return res.status(403).json({ error: "Você não tem permissão para concluir este pedido" });

    const updated = await prismaClient.pedido.update({
      where: { id: Number(id) },
      data: { status: "CONCLUIDO" }
    });

    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Erro ao concluir pedido", details: err });
  }
}

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { prismaClient } from "../../prisma/prisma.ts";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password, name } = req.body;
    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }
    // Verificar se usuário já existe
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ error: "Usuário já existe" });
    }
    // Hash da senha com bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Criar usuário no banco de dados
    const user = await prismaClient.user.create({
      data: { email, password: hashedPassword, name: name || null },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    return res.status(201).json(user);
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
  return res.status(400).send("Not Found");
};

// Ambiente de produção: use variáveis de ambiente
const ACCESS_TOKEN_SECRET = "chaveSuperSecreta123";
const REFRESH_TOKEN_SECRET = "chaveMuitoMuitoSecreta456";
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await prismaClient.user.findUnique({ where: { email } }); // Verificar se usuário existe e senha está correta
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Credenciais inválidas" });
    } 
    // Gerar access token (curta duração)
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    ); 
    // Gerar refresh token (longa duração)
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    }); 
    // Armazenar refresh token no banco de dados
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prismaClient.token.create({
      data: {
        token: refreshToken,
        type: "refresh",
        userId: user.id,
        expiresAt,
      },
    });
    res
      .status(200)
      .json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
  return res;
};
import type { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt.ts";

export interface AuthRequest extends Request {
  user?: any; // tu pode tipar melhor se quiser (ex: { id: number, email: string })
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer "))
    return res.status(401).json({ error: "token ausente" });
  try {
    const token = hdr.slice("Bearer ".length);
    const payload = verifyAccess(token);
    if (!payload) return res.status(401).json({ error: "token inválido" });

    // Assumindo que o payload contem { id: userId, email: ... }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "token inválido ou expirado" });
  }
}

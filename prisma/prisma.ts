import { PrismaClient } from "@prisma/client/extension";
export const prismaClient:PrismaClient = new PrismaClient({

    log: ["query", "info", "warn", "error"],
});
import express from "express";
import authRouter from "./routes/authRoutes.ts";
import { auth } from "./middlleware/auth.ts";
import userRouter from "./routes/userRoutes.ts";
import pedidosRouter from "./routes/pedidosRoutes.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("API RODANDO");
});

app.use(authRouter);

app.use(auth);
// privados

app.use(userRouter);

app.use(pedidosRouter);

app.listen(PORT, () => {
  console.log(`Server port ${PORT}`);
});
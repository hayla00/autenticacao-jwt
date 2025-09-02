import express from 'express';
import { prismaClient, } from '../prisma/prisma.ts';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { login, register } from './controllers/userController.ts';

enum userColumns {
    NAME = "name",
    EMAIL = "email",
    PASSWORD = "password"
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// publicos
app.post("/register", register)
app.post("/login", login)


// privados
app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/users', async (req, res) => {
    try {
        const users = await prismaClient.user.findMany();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Erro no servidor: ${error}`)
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const { params } = req;

        const user = await prismaClient.user.findUnique({
            where: {
                id: Number(params.id),
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuário não existe no banco de dados."
            })
        }

        return res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Erro no servidor: ${error}`)
    }
});




app.put("/users/:id", async (req, res) => {
    try {
        const { params, body } = req
        const bodyKeys:string[] = Object.keys(body)
        for (const key of bodyKeys) {
            if (key !== userColumns.NAME && 
                key !== userColumns.PASSWORD && 
                key !== userColumns.EMAIL) return res.status(404).send("Colunas não existentes")
        }
        const user = await prismaClient.user.update({
            where: { id: Number(params.id) },
            data: {
                ...body
            },
        })
        return res.status(200).json({
            message: "Usuário atualizado!",
            data: user
        })
    } catch (error) {
        if ((error as PrismaClientKnownRequestError).code == "P2025") {
            res.status(404).send('Usuário não encontrado!')
        }
        console.log(error);
        res.status(500).send(`Erro no servidor: ${error}`)
    }
})

app.delete("/users/:id", async(req, res)=>{
    try {
        const {params} = req
        await prismaClient.user.delete({
            where:{
                id: Number(params.id)
            }
        })
        res.status(200).send("Usuário deletado com sucesso!")
    } catch (error) {
        if ((error as PrismaClientKnownRequestError).code == "P2025") {
            res.status(404).send('Usuário não encontrado!')
        }
        console.log(error);
        res.status(500).send(`Erro no servidor: ${error}`)
    }
})

app.listen(PORT, () => {
    console.log(`Server port ${PORT}`);
});
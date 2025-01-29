import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

app.post('/tarefas', async (req,res) => {

    await prisma.tarefa.create({
        data: {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            status: req.body.status,
            dataVencimento: req.body.dataVencimento
        }
    })
    res.status(201).json(req.body)
})

app.get('/tarefas',async (req,res) => {
    let tarefas = []
    if(req.query){
        tarefas = await prisma.tarefa.findMany({
            where: {
                status: req.query.status
            }
        })
    }else{
        tarefas = await prisma.tarefa.findMany()
    }
    res.status(200).json(tarefas)
})

app.get('/tarefas/:id',async (req,res) => {

    const tarefas = await prisma.tarefa.findUnique({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json(tarefas)
})


app.put('/tarefas/:id', async (req,res) => {

    await prisma.tarefa.update({
        where: {
            id: req.params.id
        },
        data: {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            status: req.body.status,
            dataVencimento: req.body.dataVencimento
        }
    })
    res.status(201).json(req.body)
})

app.delete('/tarefas/:id', async(req,res) => {

    await prisma.tarefa.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json(req.body)
})

app.listen(3000)
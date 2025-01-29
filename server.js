import express from 'express'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
const app = express()
app.use(express.json())

// Status válidos
const STATUS_VALIDOS = ['pendente', 'realizando', 'concluida']

// Função para validar status
const validarStatus = (status) => {
    return STATUS_VALIDOS.includes(status)
}

// Criar uma nova tarefa
app.post('/tarefas', async (req, res) => {
    try {
        const { titulo, descricao, status, data_vencimento } = req.body

        if (!titulo) {
            return res.status(400).json({ error: 'Título e status são obrigatórios' })
        }
        if (!status) {
            return res.status(400).json({ error: 'Status são obrigatórios e limitados a: pendente, realizando e concluida' })
        }

        if (!validarStatus(status)) {
            return res.status(400).json({ error: 'Status inválido. Os valores válidos são: pendente, realizando, concluida.' })
        }

        const novaTarefa = await prisma.tarefa.create({
            data: { titulo, descricao, status, data_vencimento }
        })

        res.status(201).json(novaTarefa)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

// Listar todas as tarefas, com filtro opcional por status
app.get('/tarefas', async (req, res) => {
    try {
        const { status } = req.query
        const tarefas = await prisma.tarefa.findMany({
            where: status ? { status } : undefined
        })
        res.status(200).json(tarefas)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

// Buscar uma tarefa pelo ID
app.get('/tarefas/:id', async (req, res) => {
    try {
        const { id } = req.params

        const tarefa = await prisma.tarefa.findUnique({ where: { id } })

        if (!tarefa) {
            return res.status(404).json({ error: 'Tarefa não encontrada' })
        }

        res.status(200).json(tarefa)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

// Atualizar uma tarefa pelo ID
app.put('/tarefas/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { titulo, descricao, status, data_vencimento } = req.body
        

        const tarefaExistente = await prisma.tarefa.findUnique({ where: { id } })

        if (!tarefaExistente) {
            return res.status(404).json({ error: 'Tarefa não encontrada' })
        }

        const tarefaAtualizada = await prisma.tarefa.update({
            where: { id },
            data: { titulo, descricao, status, data_vencimento }
        })

        res.status(200).json(tarefaAtualizada)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

// Deletar uma tarefa pelo ID
app.delete('/tarefas/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!isUuid(id)) {
            return res.status(400).json({ error: 'ID inválido' })
        }

        const tarefaExistente = await prisma.tarefa.findUnique({ where: { id } })
        console.log(tarefaExistente)

        if (tarefaExistente == null) {
            return res.status(404).json({ error: 'Tarefa não encontrada' })
        }

        await prisma.tarefa.delete({ where: { id } })

        res.status(200).json({ message: 'Tarefa deletada com sucesso' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))

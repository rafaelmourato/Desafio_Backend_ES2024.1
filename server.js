import express from 'express'


const app = express()
app.use(express.json())

const tarefas = []

app.post('/tarefas', (req,res) => {
    tarefas.push(req.body)
    res.status(201).json(req.body)
})

app.get('/tarefas',(req,res) => {
    res.status(200).json(tarefas)
})

app.listen(3000)
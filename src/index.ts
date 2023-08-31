import express, { json } from 'express'
import cors from 'cors'
import { randomUUID } from 'node:crypto'
import { games } from './data/games.json'
import { validateGame, validatePartialGame } from './schemas/game.ts'

const port = process.env.PORT ?? 8080

const app = express()

app.use(json())

app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080'
        ]

        if (!origin) {
            return callback(null, true)
        }

        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Restringido por CORS'))
    }
}))

app.disable('x-powered-by')

app.get('/games', (req, res) => {
    res.json(games)
})

app.get('/games/:id', (req, res) => {
    const { id } = req.params
    const game = games.find(game => game.id === id)
    if (!game) {
        res.status(404).json({ message: 'No se encontro esta partida' })
    }
    return res.json(game)
})

app.post('/games', (req, res) => {
    const result = validateGame(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newGame = {
        id: randomUUID(),
        ...result.data  //tiene todos los datos ya validados de mi schema
    }

    games.push(newGame)
    return res.status(201).json(newGame)
})

app.patch('/games/:id', (req, res) => {
    const result = validatePartialGame(req.body)
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const gameIndex = games.findIndex(game => game.id === id)
    if (gameIndex < 0) {
        res.status(404).json({ message: 'No se encontro esta partida' })
    }

    const updatedGame = {
        ...games[gameIndex],
        ...result.data
    }

    games[gameIndex] = updatedGame

    return res.status(200).json(updatedGame)
})

app.delete('/games/:id', (req, res) => {
    const { id } = req.params

    const gameIndex = games.findIndex(game => game.id === id)
    if (gameIndex < 0) {
        res.status(404).json({ message: 'No se encontro esta partida' })
    }

    games.splice(gameIndex, 1)

    return res.status(200).json({ message: 'Partida eliminada' })
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})
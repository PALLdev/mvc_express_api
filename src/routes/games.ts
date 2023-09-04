import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { validateGame, validatePartialGame } from '../schemas/game'
import { games } from '../data/games.json'

export const gamesRouter = Router()

gamesRouter.get('/', (req, res, next) => {
    res.json(games)
})

gamesRouter.get('/:id', (req, res, next) => {
    const { id } = req.params

    const game = games.find(game => game.id === id)
    if (!game) {
        res.status(404).json({ message: 'No se encontro esta partida' })
    }
    return res.json(game)
})

gamesRouter.post('/', (req, res, next) => {
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

gamesRouter.patch('/:id', (req, res, next) => {
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

gamesRouter.delete('/:id', (req, res, next) => {
    const { id } = req.params

    const gameIndex = games.findIndex(game => game.id === id)
    if (gameIndex < 0) {
        res.status(404).json({ message: 'No se encontro esta partida' })
    }

    games.splice(gameIndex, 1)
    return res.status(200).json({ message: 'Partida eliminada' })
})
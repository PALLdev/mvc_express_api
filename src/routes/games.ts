import { Router } from 'express'
import { validateGame, validatePartialGame } from '../schemas/game'
import { GameModel } from '../models/game.ts'

export const gamesRouter = Router()

gamesRouter.get('/', async (req, res, next) => {
    const games = await GameModel.getAll()
    return res.json(games)
})

gamesRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params

    const game = await GameModel.getById({ id })
    if (!game) {
        return res.status(404).json({ message: 'No se encontro esta partida' })
    }
    return res.json(game)
})

gamesRouter.post('/', async (req, res, next) => {
    const result = validateGame(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newGame = await GameModel.create(result.data)
    return res.status(201).json(newGame)
})

gamesRouter.patch('/:id', async (req, res, next) => {
    const result = validatePartialGame(req.body)
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const game = await GameModel.update({ id, input: result.data })
    if (!game) {
        return res.status(404).json({ message: 'No se encontro esta partida' })
    }

    return res.status(200).json(game)
})

gamesRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params

    const game = await GameModel.delete({ id })
    if (!game) {
        return res.status(404).json({ message: 'No se encontro esta partida' })
    }
    return res.status(200).json({ message: 'Partida eliminada' })
})
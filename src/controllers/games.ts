import { Request, Response } from "express";
import { GameModel } from "../models/local-file-system/game";
import { validateGame, validatePartialGame } from "../schemas/game";

export class GameController {
    static async getAll(req: Request, res: Response) {
        const games = await GameModel.getAll()
        return res.json(games)
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params

        const game = await GameModel.getById({ id })
        if (!game) {
            return res.status(404).json({ message: 'No se encontro esta partida' })
        }
        return res.json(game)
    }

    static async create(req: Request, res: Response) {
        const result = validateGame(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const newGame = await GameModel.create(result.data)
        return res.status(201).json(newGame)
    }

    static async update(req: Request, res: Response) {
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
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params

        const game = await GameModel.delete({ id })
        if (!game) {
            return res.status(404).json({ message: 'No se encontro esta partida' })
        }
        return res.status(200).json({ message: 'Partida eliminada' })
    }
}
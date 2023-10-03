import { Request, Response } from "express";
import { validateGame, validatePartialGame } from "../schemas/game.ts";
import { GameModel } from "../models/database/mongodb/game.ts";

export class GameController {

    gameModel: typeof GameModel

    constructor({ gameModel }: { gameModel: typeof GameModel }) {
        this.gameModel = gameModel
    }

    getAll = async (_: Request, res: Response) => {
        const games = await this.gameModel.getAll()
        return res.json(games)
    }

    getById = async (req: Request, res: Response) => {
        const { id } = req.params

        const game = await this.gameModel.getById({ id: id })
        if (!game) {
            return res.status(404).json({ message: 'No se encontro esta partida' })
        }
        return res.json(game)
    }

    create = async (req: Request, res: Response) => {
        const result = validateGame(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const newGame = await this.gameModel.create({ input: result.data })
        return res.status(201).json(newGame)
    }

    update = async (req: Request, res: Response) => {
        const result = validatePartialGame(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params
        const game = await this.gameModel.update({ id: id, input: result.data })
        if (!game) {
            return res.status(404).json({ message: 'No se encontro esta partida' })
        }

        return res.status(200).json(game)
    }

    delete = async (req: Request, res: Response) => {
        const { id } = req.params

        const game = await this.gameModel.delete({ id })
        if (!game) {
            return res.status(404).json({ message: 'No se encontro esta partida' })
        }
        return res.status(200).json({ message: 'Partida eliminada' })
    }
}
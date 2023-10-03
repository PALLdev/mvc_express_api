import { Router } from 'express'
import { GameController } from '../controllers/games.ts'
import { GameModel } from '../models/database/mongodb/game.ts'

export const createGamesRouter = ({ gameModel }: { gameModel: typeof GameModel }) => {
    const gamesRouter = Router()

    const gameController = new GameController({ gameModel })

    gamesRouter.get('/', gameController.getAll)
    gamesRouter.post('/', gameController.create)

    gamesRouter.get('/:id', gameController.getById)
    gamesRouter.patch('/:id', gameController.update)
    gamesRouter.delete('/:id', gameController.delete)

    return gamesRouter
}


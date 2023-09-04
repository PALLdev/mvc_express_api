import { Router } from 'express'
import { GameController } from '../controllers/games.ts'

export const gamesRouter = Router()

gamesRouter.get('/', GameController.getAll)
gamesRouter.post('/', GameController.create)

gamesRouter.get('/:id', GameController.getById)
gamesRouter.patch('/:id', GameController.update)
gamesRouter.delete('/:id', GameController.delete)
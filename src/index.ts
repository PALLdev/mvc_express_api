import express, { json } from 'express'

import { createGamesRouter } from './routes/games.ts'
import { corsMiddleware } from './middlewares/cors.ts'
import { GameModel } from './models/database/mongodb/game.ts'

export const createApp = ({ gameModel }: { gameModel: typeof GameModel }) => {
    const port = process.env.PORT ?? 8080
    const app = express()

    app.disable('x-powered-by')
    app.use(json())
    app.use(corsMiddleware())

    app.use('/games', createGamesRouter({ gameModel }))

    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`)
    })
}


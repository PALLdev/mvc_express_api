import express, { json } from 'express'

import { gamesRouter } from './routes/games.ts'
import { corsMiddleware } from './middlewares/cors.ts'

const port = process.env.PORT ?? 8080
const app = express()

app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())

app.use('/games', gamesRouter)

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})
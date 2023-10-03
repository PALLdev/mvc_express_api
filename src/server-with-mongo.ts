import { createApp } from './index'
import { GameModel } from './models/database/mongodb/game'

createApp({ gameModel: GameModel })
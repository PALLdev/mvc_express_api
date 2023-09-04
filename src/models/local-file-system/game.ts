import { randomUUID } from 'node:crypto';
import { games } from '../../data/games.json'

export class GameModel {
    id?: string
    players: { name: string, points: number }[]

    constructor(id: GameModel['id'], players: GameModel['players']) {
        this.id = id;
        this.players = players
    }

    static async getAll() {
        return games
    }

    static async getById({ id }: { id: GameModel['id'] }) {
        return games.find(game => game.id === id)
    }

    static async create(input: GameModel) {
        const newGame = {
            id: randomUUID(),
            ...input  //tiene todos los datos ya validados de mi schema
        }

        games.push(newGame)
        return newGame
    }

    static async update({ id, input }: { id: GameModel['id'], input: any }) {
        const gameIndex = games.findIndex(game => game.id === id)
        if (gameIndex < 0) return false

        const updatedGame = {
            ...games[gameIndex],
            ...input
        }

        games[gameIndex] = updatedGame
        return updatedGame
    }

    static async delete({ id }: { id: GameModel['id'] }) {
        const gameIndex = games.findIndex(game => game.id === id)
        if (gameIndex < 0) return false
        games.splice(gameIndex, 1)
        return true
    }
}
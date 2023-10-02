import mysql, { ConnectionOptions, RowDataPacket } from 'mysql2/promise';
import 'dotenv/config'

const access: ConnectionOptions = {
    user: 'root',
    password: process.env.MYSQL_PASS,
    database: 'games_db',
    port: Number(process.env.MYSQL_PORT)
};

const connect = async () => {
    const conn = await mysql.createConnection(access);
    return conn
}

export class GameModel {
    players: { name: string, points: number }[]

    constructor(players: GameModel['players']) {
        this.players = players
    }

    static async getAll() {
        const connection = await connect()
        const result = await connection.query('SELECT id, winner FROM games')
        console.log(result)
    }

    static async getById({ id }: { id: string }) {
        const connection = await connect()
        const [games] = await connection.query<RowDataPacket[]>(`
            SELECT id, winner 
            FROM games 
            WHERE id = ?;
        `, [id])

        if (games.length === 0) return null

        return games[0]
    }

    static async create({ input }: { input: GameModel }) {
        const { players } = input
        const connection = await connect()
        const result = await connection.query<RowDataPacket[]>(`
        INSERT INTO players 
        (name) 
        VALUES (?);
    `, [players])
        console.log(result)
    }

    static async update({ id, input }: { id: string, input: Partial<GameModel> }) {

    }

    static async delete({ id }: { id: string }) {

    }
}
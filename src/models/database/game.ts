import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

const client = new MongoClient(process.env.MONGO_URL!, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connect() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const database = client.db("ClusterPuntosApp")
        return database.collection<GameModel>('games')
    }
    catch (error) {
        console.error('Error al conectar con la base de datos')
        console.error(error)
        await client.close()
    }
}

export class GameModel {

    players: { name: string, points: number }[]

    constructor(players: GameModel['players']) {

        this.players = players
    }

    static async getAll() {
        const db = await connect()
        if (!db) return
        return db.find({}).toArray()
    }

    static async getById({ id }: { id: string }) {
        const db = await connect()
        if (!db || !ObjectId.isValid(id)) return
        const objectId = new ObjectId(id)
        return db.findOne({ _id: objectId })
    }

    static async create(input: any) {
        const db = await connect()
        if (!db) return
        await db.insertOne(input)
        return {
            ...input
        }
    }

    static async update({ id, input }: { id: string, input: any }) {
        const db = await connect()
        if (!db || !ObjectId.isValid(id)) return
        const objectId = new ObjectId(id)
        const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { includeResultMetadata: true, returnDocument: 'after' })
        if (!ok) return false
        return value
    }

    static async delete({ id }: { id: string }) {
        const db = await connect()
        if (!db || !ObjectId.isValid(id)) return
        const objectId = new ObjectId(id)
        const { deletedCount } = await db.deleteOne({ _id: objectId })
        return deletedCount > 0
    }
}
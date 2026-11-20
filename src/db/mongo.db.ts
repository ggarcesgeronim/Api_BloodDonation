import { MongoClient, type Db } from "mongodb";
import "dotenv/config"
import { MONGODB, MONGOURL } from "../const/const.ts";

let client: MongoClient | null = null
let connection: Promise<Db> | null = null

async function connect(): Promise<Db> {
    client = new MongoClient(MONGOURL)

    try {
        await client.connect()
        const db = client.db(MONGODB)
        console.log("conexion exitosa")
        return db
    } catch (error) {
        console.error("error en la conexion con la db", error)
        await client.close().catch(() => {})
        client = null
        connection = null
        throw error
    }
}

function getMongoDb(): Promise<Db> {
    connection ??= connect()
    return connection
}

export async function closeMongoDb(): Promise<void> {
    await client?.close()
    client = null
    connection = null
}

export default getMongoDb;

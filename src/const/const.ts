import "dotenv/config"

export const MONGOURL = process.env.MONGO_URL as string
export const MONGODB = process.env.MONGO_DB as string
export const PORT = Number(process.env.PORT) || 3000
export const BLOOD_REQUESTS_COLLECTION = process.env.BLOOD_REQUESTS_COLLECTION as string
export const DONORS_COLLECTION = process.env.DONORS_COLLECTION as string

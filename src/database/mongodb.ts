import mongoose from "mongoose"
import config from "../config"

const Database = async (): Promise<void> => {
    try {
        const result = await mongoose.connect(config.env.uri)
        console.log('Connection to database')
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export default Database
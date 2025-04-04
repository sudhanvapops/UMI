import mongoose from "mongoose";

export async function connectdb() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Mongodb connected Successfully ${conn.connection.host}`);
    } catch (error) {
        console.log("Error In Connecting MongoDB",error)
        process.exit(1);
    }
}
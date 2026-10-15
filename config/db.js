import mongoose from "mongoose";

const ConnectDB = async ()=>{

    try{
        const uri = process.env.USE_PROXY === 'true'
            ? process.env.MONGODB_URI_PROXY
            : process.env.MONGODB_URI
        const conn = await mongoose.connect(uri)
        console.log(`databse connected successfully host:${conn.connection.host}`)
    }catch(error){
        console.log(`Connection Error::${error.message}`)
    }

}

export default ConnectDB
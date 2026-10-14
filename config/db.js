import mongoose from "mongoose";

const ConnectDB = async ()=>{

    try{
        const conn = await mongoose.connect(process.env.MONGDB_URI)
        console.log(`databse connected successfully host:${conn.connection.host}`)
    }catch(error){
        console.log(`Connection Error::${error.message}`)
    }

}

export default ConnectDB
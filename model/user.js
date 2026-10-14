import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    }


},{
    timestamps:true,
    collection:'userdata'
})

export default mongoose.model('userData',userDataSchema)
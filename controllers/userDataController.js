import userData  from "../model/user.js"
import bcrypt from 'bcrypt';
import generateToken from '../utils/jwtUtils.js'
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'divb_users' },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            })
        stream.end(buffer)
    })
}

export const addUser = async (req,res) => {

    try {
        const password = await bcrypt.hash(req.body.password,10)
        let imageUrl = ""
        if(req.file) {
            const result = await uploadToCloudinary(req.file.buffer)
            imageUrl = result.secure_url
        }

        const userDataVal = {
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            address:req.body.address,
            password:password,
            image:imageUrl
        }
        const saveData = await userData.create(userDataVal)
        // Email send 
        try {
            const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    sender: { name: "My App", email: "harsh.mongodb@gmail.com" },
                    to: [{ email:req.body.email}],
                    subject: "Welcome Email",
                    htmlContent: "<p>Welcome to our website</p>",
                }),
            })
            if (!brevoRes.ok) {
                console.error('Brevo email failed:', brevoRes.status, await brevoRes.text())
            }
        } catch (emailError) {
            console.error('Brevo email error:', emailError.message)
        }


        res.status(200).json({data:saveData,status:"success",message:"Data save successfully"})


    } catch(error){
        res.status(500).json({errorMessage:error.message})

    }

}

export const getUser = async (req,res) => {
    try {
        const getuserData = await userData.find()
        res.status(200).json({message :"user data get successfully dffdjghfdj",data:getuserData})
    }catch(error) {
        res.status(500).json({errorMessage:error.message})
    }
}

export const getSingleUser = async (req,res) => {
    try{
        const id = req.params.uid
        const singleUSer = await userData.findById(id)
        res.status(200).json({message :"user data get successfully",data:singleUSer})
    }catch(error) {
        res.status(500).json({errorMessage:error.message})
    }
}


export const deleteUser = async(req,res) => {
    try{
        const id = req.params.uid
        const deleuser = await userData.findByIdAndDelete(id)
        res.status(200).json({message:"user delete successfully",deletData:deleuser})


    }catch(error) {
        res.status(500).json({errorMessage:error.message})
    }
}

export const updateUSer = async(req,res) => {
    try {
        const id = req.params.uid

        const userdataVal = {
            name:req.body.name,
            email:req.body.email,
            address:req.body.address,
            phone:req.body.phone
        }

        const updateUSerdata = await userData.findByIdAndUpdate(id,userdataVal,{
            new:true,
            runValidators:true
        })

        res.status(200).json({message:"userdata updated successfully",data:updateUSerdata})
        
    }catch(error) {
        res.status(500).json({errorMessage:error.message})
    }
}

export const login = async (req,res) => {
    try {


        const uData = await userData.findOne({email:req.body.email})
        if(!uData) {
            return res.status(200).json({message:"User Not Found",status:0})
        }
        const passwordMatch = await bcrypt.compare(req.body.password,uData.password)
        if(passwordMatch) {
            const token = await generateToken(uData)
             res.status(200).json({message:"Login Successfully",status:1,data:uData,token:token})
        }
        
        res.status(200).json({message:"Password not match",status:0})

    }catch(error) {
        res.status(500).json({errorMessage:error.message})
    }
}
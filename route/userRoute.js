import express from "express"
import { addUser,getUser,getSingleUser,deleteUser,updateUSer,login } from "../controllers/userDataController.js"
import AuthanticateToken from '../utils/authMiddlware.js'
import upload from "../utils/uploadMiddleware.js"
const router = express.Router()
router.post('/api/add-user',upload.single('image'),addUser)
router.get('/api/get-user',AuthanticateToken,getUser)
router.get('/api/get-singleuser/:uid',AuthanticateToken,getSingleUser)
router.delete('/api/delete-user/:uid',AuthanticateToken,deleteUser)
router.put('/api/update-user/:uid',AuthanticateToken,updateUSer)
router.post('/api/login',login)


export default router
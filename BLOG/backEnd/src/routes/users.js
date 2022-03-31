
const express=require('express')
// const app=express()
const router=express.Router()
const {authMiddleware}=require('../middleware/admin/auth.middleware')

const UserController=require('../controller/users')

router.post('/',UserController.createUser)

router.post('/login',UserController.login)

router.get('/',authMiddleware,UserController.getUser)

//patch局部更新   put 整体更新
router.patch('/',authMiddleware,UserController.updateUser)




module.exports=router
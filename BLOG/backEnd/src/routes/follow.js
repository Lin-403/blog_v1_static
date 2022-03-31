
const express=require('express')
// const app=express()
const router=express.Router()
const {authMiddleware}=require('../middleware/admin/auth.middleware')

//关注者
const FollowController=require('../controller/follow')
//
router.post('/:username',authMiddleware,FollowController.follow)
//被关注者
router.delete('/:username',authMiddleware,FollowController.cancelFollow)
router.get('/:username',authMiddleware,FollowController.getFollowers)






module.exports=router
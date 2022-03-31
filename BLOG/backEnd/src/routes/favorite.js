
const express=require('express')
// const app=express()
const router=express.Router()
const {authMiddleware}=require('../middleware/admin/auth.middleware')
//关注者
const FavoriteController=require('../controller/favorites')


//喜欢
router.post('/:slug',authMiddleware,FavoriteController.addFavorite)
//取消喜欢
router.delete('/:slug',authMiddleware,FavoriteController.removeFavorite)


module.exports=router
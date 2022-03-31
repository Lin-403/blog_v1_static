const express=require('express')
const router=express.Router()
const {authMiddleware}=require('../middleware/admin/auth.middleware')


const ArticleController=require('../controller/articles')

router.post('/',authMiddleware,ArticleController.createArticle)

//获取所有文章
router.get('/',ArticleController.getArticles)
//获取关注的所有文章
router.get('/follow',authMiddleware,ArticleController.getFollowArticle)
//获取单个文章
router.get('/:slug',ArticleController.getArticle)

//更新
router.put('/:slug',authMiddleware,ArticleController.updateArticle)
//删除
router.delete('/:slug',authMiddleware,ArticleController.deleteArticle)



module.exports=router
const HttpException = require("../exceptions/http.exception")
const Article = require("../models/article")
const Tag = require("../models/tag")
const Comment=require('../models/comment')
const User = require("../models/user")

//创建评论
module.exports.createComment=async (req,res,next)=>{
   console.log('createComment')
    try{
       //获取文章参数
           //slug
        const {slug}=req.params 
           //评论内容
        const {body}=req.body.comment 
        //接口参数验证
        if(!body){
            throw new HttpException(401,'评论内容不能为空','Comment content cannot be empty')
        }
        //获取文章
        const article=await Article.findByPk(slug)
            //校验 文章是否存在
        if(!article){
            throw new HttpException(404,'当前文章不存在','The current article does not exist')
        }
        //获取评论用户
        const user=await User.findByPk(req.user.email)
            //校验:用户是否存在
        // console.log(user)
        if(!user){
            throw new HttpException(404,'未登录不能发表评论','You cannot comment without logging in')
        }
        //创建评论 存储评论内容
        let newComment=await Comment.create({body})

        //创建关系:
            // 登录用户和评论
        await user.addComments(newComment)
            // 被评论的文章和评论
        await article.addComments(newComment)
        //优化返回信息:评论里面追加评论人和文章信息
        newComment.dataValues.user={
            username:user.username,
            bio:user.bio,
            avatar:user.avatar
        }
        //响应
        res.status(200)
        .json({
            status:1,
            message:'发表评论成功',
            data:newComment
        })
   }catch(error){
       next(error)
   }
}

//获取文章评论
module.exports.getComments=async (req,res,next)=>{
    try{
       //获取文章参数
           //slug
        const {slug}=req.params 
        //获取文章
        const article=await Article.findByPk(slug)
            //校验 文章是否存在
        if(!article){
            throw new HttpException(404,'当前文章不存在','The current article does not exist')
        }
        //获取文章评论
            //条件查询 :articleSlug=slug
            //包含评论人的信息
        const comments=await Comment.findAll({
            where:{
                articleSlug:slug
            },
            include:[{
                model:User,
                attributes:['username','bio','avatar']
            }]
        })
        //相应信息
        res.status(200)
         .json({
             status:1,
             message:'获取评论成功',
             data:comments
         })
    }catch(error){
        next(error)
    }
 }

 //删除文章评论
module.exports.deleteComment=async (req,res,next)=>{
    try{
        //获取参数
           //文章:slug
        const {slug,id}=req.params
           //评论:id
        //获取文章
        const article=await Article.findByPk(slug)
           //校验 文章是否存在
        if(!article){
            throw new HttpException(404,'当前文章不存在','The current article does not exist')
        }
        //获取评论
           //校验
        const comment=await Comment.findByPk(id)
           //校验 
        if(!comment){
           throw new HttpException(404,'当前评论不存在','Current comment does not exist')
        }
        //业务验证
           //当前登录用户是否是评论人
           //文章的作者可以删除
        if(req.user.email!==comment.userEmail){
            throw new HttpException(403,'没有删除其他人评论的权限',"No permission to delete other people's comments")           
        }
        // 删除操作
        console.log(comment)
        await Comment.destroy({
            where:{id}
        })
        // 响应数据
        res.status(200)
        .json({
            status:1,
            message:'删除评论成功'
        })
    }catch(error){
        next(error)
    }
 }
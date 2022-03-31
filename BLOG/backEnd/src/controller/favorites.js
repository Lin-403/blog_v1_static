const HttpException = require("../exceptions/http.exception")
const User = require('../models/user')
const Article=require('../models/article')
const Tag=require('../models/tag')
//
function handleAracle(article,author,count){
    const newTags=[]
    for(const t of article.dataValues.tags){
        newTags.push(t.name)
    }
    article.dataValues.tags=newTags

     // 作者信息优化
     delete author.dataValues.password
     delete author.dataValues.email
     article.dataValues.author=author

     article.dataValues.favoriteCount=count 
     article.dataValues.favorited=true 

     return article.dataValues
}


//添加喜欢
module.exports.addFavorite=async (req,res,next)=>{
    try{
        //获取文章参数
        const {slug}=req.params

        //获取文章  包含tag
        var article=await Article.findByPk(slug,{include:Tag})
        if(!article){
            throw new HttpException(404,'喜欢的文章不存在','Favorite article does not exist')
        }
        //添加喜欢   添加被喜欢的用户
        // console.log(article)
        await article.addUsers(req.user.email) //文章可以被多个人喜欢
        //获取文章作者
        const author=await article.getUser()
        //获取喜欢个数
        const count=await article.countUsers()
        //数据处理 tag、author、喜欢个数
        article=handleAracle(article,author,count)
        //响应数据
        res.status(200)
           .json({
               status:1,
               message:'添加喜欢成功',
               data:article
           })
    }catch(error){
        next(error)
    }
}

//取消喜欢
module.exports.removeFavorite=async (req,res,next)=>{
    try{
        //获取文章参数
        const {slug}=req.params

        //获取文章  包含tag
        var article=await Article.findByPk(slug,{include:Tag})
        if(!article){
            throw new HttpException(404,'喜欢的文章不存在','Favorite article does not exist')
        }
        //取消喜欢   添加被喜欢的用户
        // console.log(article)
        await article.removeUsers(req.user.email) //移除喜欢的文章
        //获取文章作者
        const author=await article.getUser()
        //获取喜欢个数
        const count=await article.countUsers()
        //数据处理 tag、author、喜欢个数
        article=handleAracle(article,author,count)
        //响应数据
        article.favorited=false
        console.log(article)
        res.status(200)
           .json({
               status:1,
               message:'取消喜欢成功',
               data:article
           })
    }catch(error){
        next(error)
    }
}


//获取粉丝  &&  判断当前登录用户是否关注
module.exports.getFollowers=async (req,res,next)=>{
    try{
    // 获取参数：作者用户名 author
    const username=req.params.username

    // 校验：提供被关注用户  
        // 参数校验
        // 业务验证
            // 获取作者信息:连表查询 获取所有粉丝 [emails]
            // 作者信息是否存在
    const author=await User.findOne({
        where:{
            username
        },
        include:['follower']
    })
    // console.log('author',author)
    
    if(!author){
        throw new HttpException(404,'被关注的用户不存在','The author is not found')
    }
    // 验证是否关注
        // 当前登录粉丝 email :通过token
        // 是否关注:判断 当前登录的用户email是否在作者的所有粉丝email里面
    const {email}=req.user
    let followers=[]
    var following=false
    // console.log('email',email)
    for(const fans of author.follower){
        // console.log(user.dataValues)
        if(fans.dataValues.email===email) following=true
        delete fans.dataValues.password
        delete fans.dataValues.Follows
        followers.push(fans.dataValues)
    }
    console.log(followers)
    // 返回作者信息
        // 基本信息
        // 关注状态
        // 粉丝信息
    const profile={
        email:author.email,
        username:author.username,
        avatar:author.avatar,
        bio:author.bio,
        following,
        followers,
    }
    res.status(200)
        .json({
            status:1,
            message:'获取作者信息成功',
            data:profile
        })
    }catch(error){
        next(error)
    }
}
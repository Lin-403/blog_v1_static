const HttpException = require("../exceptions/http.exception")
const User = require('../models/user')
const Tag = require('../models/tag')
const {validateCreateUser}=require('../utils/vaildate/article.vaildate')
const { getSlug } = require("../utils/slug")
const Article=require('../models/article')
const sequelize = require("../db/sequelize")

function handleAracle(article,author){
    const newTags=[]
    for(const t of article.dataValues.tags){
        newTags.push(t.name)
    }
    article.dataValues.tags=newTags

     // 作者信息优化
     delete author.dataValues.password
     delete author.dataValues.email
     article.dataValues.author=author

     return article.dataValues
}

// article包含author
const handleAracles=async (currentEmail,article)=>{
    //处理标签
    const newTags=[]
    for(const t of article.dataValues.tags){
        newTags.push(t.name)
    }
    article.dataValues.tags=newTags

    //处理作者信息
    let {username,email,bio,avatar}=article.dataValues.user
    let author={
        username,email,bio,avatar
    }
    delete article.dataValues.user 
    article.dataValues.author=author

    //喜欢文章的个数
    const favoriteCount=await article.countUsers()
    if(favoriteCount==0){
        article.dataValues.isFavorite=false
        article.dataValues.favoriteCount=0
        return article.dataValues
    }
//未登录
    if(!currentEmail){
        article.dataValues.isFavorite=false
        article.dataValues.favoriteCount=favoriteCount
        return article.dataValues
    }

    if(currentEmail){
        //当前登录用户是否已经喜欢本文章
        const allFavoriteUsers=await article.getUsers()
        console.log(allFavoriteUsers)
        let allFavoriteUsersEmails=[]
        allFavoriteUsers.forEach(user=>{
            allFavoriteUsersEmails.push(user.email)
        })

        let isFavorite=allFavoriteUsersEmails.includes(currentEmail)


        article.dataValues.isFavorite=isFavorite
        article.dataValues.favoriteCount=favoriteCount
        return article.dataValues
    }
}

//创建文章
module.exports.createArticle=async (req,res,next)=>{
   try{
        // 获取请求的内容
        const {title,description,body,tags}=req.body.article
        // console.log(title,description,body)
        // 请求内容验证
        let {error,validate}= validateCreateUser(title,description,body)
        if(!validate){
            throw new HttpException(401,'文章创建参数验证失败',error)
        }
        // 获取作者信息:token解签=>email=.author信息(只有登陆的作者才能创建自己的文章)
        const {email}=req.user
        const author=await User.findByPk(email)
        if(!author){
            throw new HttpException(401,'作者账号不存在','The author account does not exist')
        }
        // 创建文章
        //   生成别名
        let slug = getSlug()
        //   存储数据:文章和作者数据email
        console.log(author)
        let article=await Article.create({
             slug,
             title,
             description,
             body,
             userEmail:author.dataValues.email
        })
        // 创建文章和标签的关系
            // 系统自带标签 :xxx

            // 自定义标签 :自己添加的标签
        if(tags){
            for(const t of tags){
                let existTag=await Tag.findByPk(t)
                let newTag
                if(!existTag){
                    //标签存储
                    newTag=await Tag.create({name:t})

                    //文章和标签的关联 taglist
                    // console.log(article.__proto__)
                    await article.addTag(newTag)
                }
                else{
                    //文章和标签的关联 taglist
                    await article.addTag(existTag)
                }
                
            }
        }

        // 返回文章数据
        //    根据slug别名获取数据(文章+标签+作者)
        article=await Article.findByPk(slug,{include:Tag})
        // console.log(author.dataValues.email)    
        // 标签返回优化 // 作者信息优化
        article=handleAracle(article,author)
        // console.log(article.tags)

           
            // 文章数据优化返回
        // console.log(article)
       
        res.status(200)
         .json({
             status:1,
             message:"文章创建成功",
             data:article
         })
   }
   catch(error){
       next(error)
   }
}

//获取文章:单个文章
module.exports.getArticle=async (req,res,next)=>{
    console.log('getArticle')
    try{
        //获取参数:slug
        const {slug}=req.params
        //获取文章:根据slug及 关联的标签
        let article=await Article.findByPk(slug,{include:Tag})
       if(!article){
        throw new HttpException(404,'文章不存在','Article does not exist')

       }
        // console.log(article) 
      
        //获取当前文章的作者信息:useEmail
        const author=await article.getUser()
        //返回数据处理:标签和作者信息
        article=handleAracle(article,author)
        //响应数据
        res.status(200)
         .json({
             status:1,
             message:'获取文章信息成功',
             data:article
         })
    }
    catch(error){
        next(error)
    }
 }

 //获取文章:关注的作者的文章
module.exports.getFollowArticle=async (req,res,next)=>{
    try{
         //获取登录用户
         const fansEmail=req.user.email
         //获取当前登录用户的关注的作者 follows
         const query=`SELECT userEmail FROM follows WHERE followerEmail="${fansEmail}"`
        const followAuthors=await sequelize.query(query)
        // console.log(followAuthors[0])
             //如果没有关注的作者,没有关注的作者的文章
        if(followAuthors[0].length==0){
             return res.status(200)
             .json({
                 status:1,
                 message:'当前没有关注的作者',
                 data:[]
             })
        }
         //获取作者email
         let followAuthorEmails=[]
         for(const t of followAuthors[0]){
            followAuthorEmails.push(t.userEmail)
         }
         //遍历email获取文章
         //获取作者文章
            //遍历获取作者email
        let {count,rows}=await Article.findAndCountAll({
            distinct:true,//去重 =>
            where:{
                UserEmail:followAuthorEmails //直接等于一个数组
            }
            ,include:[Tag,User]
        })
        // console.log(articleAll)
        
            //获取每一个作者的所有文章(标签+作者信息)
         //每一个作者文章处理(标签+作者信息)
         let articles=[]
         for(const t of rows){
            let handleAracle=await handleAracles(fansEmail,t)
            articles.push(handleAracle)
         }
         //响应数据
         res.status(200)
         .json({
             status:1,
             message:'获取关注的作者的文章成功',
             data:{articles,articlesCount:count}
         })
    }
    catch(error){
        // console.log(error)
        next(error)
    }
 }

 //获取文章:条件获取(tag,author,limit) 全局文章
 //限制  偏移量
 //标签  文章   //限制  偏移量
 //作者  文章    //限制  偏移量
 //作者  标签  文章   //限制  偏移量

module.exports.getArticles=async (req,res,next)=>{
    try{
        //当前登录用户
        const email=req.user?req.user.email:null
        //  获取条件参数  ：query tag author limit offset
        const {tag,author,limit=10,offset=0}=req.query
        //获取文章数组：
        var result=[]
            // 有标签没作者  +分页数据
        if(tag&&!author){
            result=await Article.findAndCountAll({
                distinct:true,
                include:[{
                    model:Tag,
                    attributes:['name'],
                    where:{name:tag}
                },{
                    model:User,
                    attributes:['email','username','bio','avatar'],
                    
                }],
                limit:parseInt(limit),
                offset:parseInt(offset)
            })
        }
            // 有作者没标签  +分页数据
        else if(!tag&&author){
            result=await Article.findAndCountAll({
                distinct:true,
                include:[{
                    model:Tag,
                    attributes:['name'],
                },{
                    model:User,
                    attributes:['email','username','bio','avatar'],
                    where:{username:author}
                }],
                limit:parseInt(limit),
                offset:parseInt(offset)
            })
        }
            // 有作业和标签  +分页数据
        else if(tag&&author){
            result=await Article.findAndCountAll({
                distinct:true,
                include:[{
                    model:Tag,
                    attributes:['name'],
                    where:{name:tag}
                },{
                    model:User,
                    attributes:['email','username','bio','avatar'],
                    where:{username:author}
                }],
                limit:parseInt(limit),
                offset:parseInt(offset)
            })
        }
        // 没有作业和标签  +分页数据
        else {
            console.log("NUMMMM")
            result=await Article.findAndCountAll({
                distinct:true,
                include:[{
                    model:Tag,
                    attributes:['name'],
                },{
                    model:User,
                    attributes:['email','username','bio','avatar'],
                }],
                limit:parseInt(limit),
                offset:parseInt(offset)
            })
        }

        const {count,rows}=result
        console.log(count)
        // console.log(rows)
        // 文章数据处理
            //  宾利获取文章 处理标签和作者信息
        var articles=[]
        for (const it of rows) {
            let handleAracle=await handleAracles(email,it)
            articles.push(handleAracle)
        }

        // 响应
        return res.status(200)
         .json({
             status:1,
             message:'条件查询获取文章成功',
             data:{articles,articlesCount:count}
         })
    }
    catch(error){
        next(error)
    }
 }


 //更新文章
 module.exports.updateArticle=async (req,res,next)=>{
    try{
        
        //中间件登陆验证
        //获取参数:slug
        const {slug}=req.params
        //获取更新内容:body
        const {title,description,body}=req.body.article
        //获取更新文章:根据slug获取需要更新的文章(标签)
        let article=await Article.findByPk(slug,{include:Tag})
        //只有当前登录的用户是作者才能修改,修改文章权限验证
        const {email}=req.user
        const loginUser=await User.findByPk(email)
        if(!loginUser){
            throw new HttpException(401,'登录账号不存在','The author account does not exist')
        }
        const authorEmail=article.userEmail
        console.log(authorEmail)
        console.log(loginUser.email)
        if(authorEmail!==loginUser.email){
            throw new HttpException(403,'仅作者有修改本文章权限','Only the author has the permission to modify this article')
        }
        //修改字段准备
        const newTitle=title?title:article.title
        // console.log(newTitle)
        const newDescription= description? description:article.description
        const newBody=body?body:article.body
        //更新数据操作
       
        const updateArticle=await article.update({
            title:newTitle,
            description:newDescription,
            body:newBody
        })
        // console.log(updateResult)
        //返回数据处理:标签和作者信息
        article=handleAracle(updateArticle,loginUser)
        //响应数据
        res.status(200)
         .json({
             status:1,
             message:'更新文章成功',
             data:article
         })
    }
    catch(error){
        next(error)
    }
 }

  //删除文章
  module.exports.deleteArticle=async (req,res,next)=>{
    try{
        //获取参数:slug
        const {slug}=req.params
        //获取文章:根据slug及 关联的标签
        //  文章不存在,抛出异常
        let article=await Article.findByPk(slug,{include:Tag})
        if(!article){
            throw new HttpException(404,'文章不存在','Article does not exist')
        }
        // console.log(article) 
      
        //获取当前登录用户信息:useEmail
        const loginUser=await User.findByPk(req.user.email)
            // 验证当前登录用户是否是作者,(删除权限问题)
        const authorEmail=article.userEmail
        // console.log(authorEmail,loginUser.dataValues.email)
        if(authorEmail!==loginUser.dataValues.email){
            throw new HttpException(403,'仅作者有删除本文章权限','Only the author has the permission to delete this article')
        }
        //删除文章:依据slug
        await Article.destroy({where:{slug}})
       
        //响应数据
        res.status(200)
         .json({
             status:1,
             message:'删除文章成功'
         })
    }
    catch(error){
        next(error)
    }
 }
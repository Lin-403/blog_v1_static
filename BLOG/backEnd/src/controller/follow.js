const HttpException = require("../exceptions/http.exception")
const User = require('../models/user')


//添加关注
module.exports.follow=async (req,res,next)=>{
    try{
        // 获取参数  ：被关注的用户名
        const username=req.params.username
        // 校验
            // 参数校验
        if(!username){
            throw new HttpException(401,'作者不存在','Author does not exist')
        }
            // 业务验证：被关注的用户是否存在
        //被关注的人----查找被关注的人的信息
        const author=await User.findOne({
            where:{
                username
            }
        })
        if(!author){
            throw new HttpException(404,'被关注的用户不存在','The author is not found')
        }
           
        // 关注者信息(粉丝) ------根据当前登陆的人的token进行查询
            // 获取email：token
        const {email}=req.user
            // 获取用户信息
            //关注者
        const followerUser=await User.findByPk(email)
        // 添加关注   被关注的人添加了一个粉丝
            // 被关注者主键和关注者存储到数据库followers
        author.addFollower(followerUser)
        // 返回被关注者的信息
            // 基本信息
        const profile={
            username:author.username,
            bio:author.bio,
            avatar:author.avatar,
            following:true
        }
            // 被关注状态
        res.status(200)
           .json({
               status:1,
               message:'关注成功',
               data:profile
           })
    }catch(error){
        next(error)
    }
}

//取消关注
module.exports.cancelFollow=async (req,res,next)=>{
    try{
        // 获取参数  ：被关注的用户名
        const username=req.params.username
        // 校验
            // 参数校验
        // let { error, validate } = validateCreateUser(username, password, email)
        // if (!validate) {
        //     throw new HttpException(401, '用户提交数据验证失败', error)
        // }
            // 业务验证：被关注的用户是否存在
        //被关注的人----查找被关注的人的信息
        const author=await User.findOne({
            where:{
                username
            }
        })
        if(!author){
            throw new HttpException(404,'被关注的用户不存在','The author is not found')
        }
           
        // 关注者信息(粉丝) ------根据当前登陆的人的token进行查询
            // 获取email：token
        const {email}=req.user
            // 获取用户信息
            //关注者
        const followerUser=await User.findByPk(email)
        // 取消关注   被关注的人粉丝表中删除了一条粉丝数据
            // 被关注者主键和关注者存储到数据库followers
        author.removeFollower(followerUser)
        // 返回被关注者的信息
            // 基本信息
        const profile={
            username:author.username,
            bio:author.bio,
            avatar:author.avatar,
            following:false
        }
            // 被关注状态
        res.status(200)
           .json({
               status:1,
               message:'取消关注成功',
               data:profile
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
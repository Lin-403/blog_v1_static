
const dbConnection=require('../db/connection')
//同步
const sequelize=require('../db/sequelize')
const User=require('../models/user')
const Article=require('../models/article')
const Comment=require('../models/comment')
const Tag=require('../models/tag')

const initRelation=()=>{
    //用户和文章关系：一对多
    User.hasMany(Article,{
        onDelete:'CASCADE'
    })
    Article.belongsTo(User)
    
    //用户和评论:一对多
    User.hasMany(Comment,{
        onDelete:'CASCADE'
    })
    Comment.belongsTo(User)


    //文章和评论 一对多
    Article.hasMany(Comment,{onDelete:'CASCADE'})
    Comment.belongsTo(Article)

    //  用户和文章（喜欢❤）：多对多
    User.belongsToMany(Article,{
        through:'Favorites',
        timestamps:false
    })
    Article.belongsToMany(User,{
        through:'Favorites',
        timestamps:false
    })
    
    // User(源) - User(关注 目标模型)
    User.belongsToMany(User,{
        through:'Follows', //自动创建模型
        as: 'follower',  //目标模型的别名
        timestamps:false
    })

    //文章和标签：多对多
    Article.belongsToMany(Tag,{
        through:'TagList',
        uniqueKey:false,
        timestamps:false
    })
    Tag.belongsToMany(Article,{
        through:'TagList',
        uniqueKey:false,
        timestamps:false
    })

}

const initDB=()=>{
    return new Promise(async (resolve,reject)=>{
       
       try {
           //数据库连接
            await dbConnection()
            //其他操作
            initRelation()

            //同步所有模型和关系
            await sequelize.sync({alter:true})
            // alter:true
            
            resolve()

       }catch(error){
           console.log(error)
           reject(error)
       }
    })
}

module.exports=initDB
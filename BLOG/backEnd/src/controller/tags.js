const HttpException = require("../exceptions/http.exception")
const Tag = require('../models/tag')


//获取所有标签  ->创建文章
module.exports.getTags=async (req,res,next)=>{
    try{
        // 模型查询所有标签
        const tagsAll= await Tag.findAll()
        console.log(tagsAll)

        // 标签处理:[tag1,tag2]
        const tags=[]
        if(tagsAll.length>0){
            for(const t of tagsAll){
                 tags.push(t)
            }
        }
        // 响应数据
         res.status(200)
          .json({
              status:1,
              message:'获取标签成功',
              data:tags
          })
    }catch(error){
        next(error)
    }
}

//创建标签
module.exports.createTag=async (req,res,next)=>{
    try{
    //    参数获取
    const tag=req.body.tag
    console.log(tag)
    //标签验证
    if(tag.length>10){
        throw new HttpException(401,'标签名长度不能大于10','The length of the label cannot be larger than 10')
    }
    if(!tag){
        throw new HttpException(401,'标签名不能为空','The label name cannot be empty')
    }
    // 标签存储
    // Tag.create({name:tag})

    const tagResult=await Tag.create({name:tag})
    console.log('tagResult',tagResult)

    res.status(200)
     .json({
         status:1,
         message:'标签创建成功',
         data:tagResult.dataValues.name
     })
    }catch(error){
        next(error)
    }
}


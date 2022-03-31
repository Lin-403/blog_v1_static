
const HttpException=require('../exceptions/http.exception')

const noMatchMiddleware=(req,res,next)=>{
    //监听404错误，出错然后向前端发送信息。
    // res.status(404)
    //   .json({
    //       code:0,
    //       message:'router url not found'
    //   })
    const noMatchError=new HttpException(404,'访问路径不匹配','Router url not found')
    next(noMatchError)
}

module.exports=noMatchMiddleware



const errorMatchMiddleware=(error,req,res,next)=>{
    //error 是 HttpException的实例
    const status=error.status||500
    const message=error.message||'服务器端错误'
    const errors=error.errors||'Server is wrong'
    res.status(status)
        .json({
            code:0,
            message,
            errors
    })
}

module.exports=errorMatchMiddleware

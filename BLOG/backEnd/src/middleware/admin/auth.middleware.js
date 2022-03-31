const { decode } = require("../../utils/jwt");
const HttpException = require("../../exceptions/http.exception");

//获取用户登录信息时，需要登录注册，登陆注册需要检查token令牌。
module.exports.authMiddleware=async(req,res,next)=>{
    // console.log('authMiddleware')
    //获得token
    // console.log(req.headers.authorization)
    // console.log(req.header('authorization'))

    //01 authorization header
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return next(new HttpException(401,'authHeader is missing'))
    }

    //02验证token类型
    const tokenType=authHeader.split(' ')[0]
    // console.log(token)
    if(tokenType!=='Token'){
        return next(new HttpException(401,'authorizaion 格式错误,格式:Token tokenContent','Token missing'))
    }

     //03验证token内容
    const tokenContent=authHeader.split(' ')[1]
    //   console.log(tokenContent)
    if(!tokenContent){
        return next(new HttpException(401,'authorizaion 格式错误,格式:Token tokenContent','Token content missing'))
    }
    
    // 04解签
    try{
        // console.log("token   ",tokenContent)
        // console.log(await decode(tokenContent))
        const user=await decode(tokenContent)
        // console.log("zhong",user)
        if(!user){
            return next(new HttpException(401,"Token 内容不存在","Token decode error"))
        }
        req.user=user;

        //给req追加token
        req.token=tokenContent
        return next()
    }
    catch(error){
        //jwt 验证失败 ；token 失败 过期等
         return next(new HttpException(401,'Authorizaion token 验证失败',e.message))
    }
    

}
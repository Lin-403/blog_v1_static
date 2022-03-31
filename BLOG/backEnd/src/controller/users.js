//用户相关控制器

const { validateCreateUser, validateUserLogin } = require('../utils/vaildate/user.vaildate')
const HttpException = require('../exceptions/http.exception')
const User = require('../models/user')
const { md5Password, matchPassword } = require('../utils/md5')
const { sign } = require('../utils/jwt')

//用户注册
module.exports.createUser = async (req, res, next) => {

    try {
        //获取用户提交的内容
        let { username, password, email } = req.body.user

        //数据验证
        let { error, validate } = validateCreateUser(username, password, email)
        if (!validate) {
            throw new HttpException(401, '用户提交数据验证失败', error)
        }
        //业务验证
        //1) 验证email是否存在----查找主键
        const existUser = await User.findByPk(email)
        if (existUser) {
            throw new HttpException(401, '用户邮箱已存在', 'Email is exist')
        }
        //创建用户
        //1) 密码加密
        const md5Pwd = await md5Password(password)
        // 2)User model 存储数据库
        const user = await User.create({
            username,
            password: md5Pwd,
            email
        })

        // 3)创建成功：返回
        if (user) {
            console.log(user)
            // 3.1)创建token
            let data = {}
            data.username = username
            data.email = email
            data.token = await sign(data)
            data.bio = null
            data.avator = null

            // 3.2)返回数据
            res.status(201)
                .json({
                    status: 1,
                    data,
                    message: '创建用户成功'
                })
        }

    } catch (error) {
        next(error)
    }
    // 整体异常捕获
    // next(error)
}

//用户登录
module.exports.login = async (req, res, next) => {
    try {
        //访问接口权限----》不需要，都可以登录

        //获取请求数据，email password(服务端处理)
        let { email, password } = req.body.user

        //验证请求数据：email password字段是否正确(服务端处理)
        let { error, validate } = validateUserLogin(email, password)
        //验证业务逻辑：(服务端处理)
        if (!validate) {
            throw new HttpException(401, '用户提交数据验证失败', error)
        }
        //用户是否存在
        const user = await User.findByPk(email)
        if (!user) {
            throw new HttpException(401, '用户不存在', 'User is not found')
        }
        //密码是否正确
        //user是从数据库中查到的user
        // console.log(user)
        const oldMd5Pwd = user.dataValues.password
        // aba638edcce6c07434844588af05d4ac
        // console.log(oldMd5Pwd,'-----',password)
        const match =await matchPassword(oldMd5Pwd, password)
        // console.log('------------------------------------------------',match)
        if (!match) {
            throw new HttpException(401, '用户输入密码错误', "The password is wrong!")
        }
        //返回数据(服务端 -> 客户端)
        //生成token-----生成用户访问的令牌
        delete user.dataValues.password
        user.dataValues.token = await sign(user)


        //返回给客户信息
        return res.status(200).json({
            status: 1,
            data: user.dataValues,
            message: '用户登录成功'
        })
    }
    catch (e) {
        next(e)
    }
}

//获取用户信息
module.exports.getUser = async (req, res, next) => {
    //获取用户信息

    // 验证接口权限：验证token=>req.user={username,email} //路由中间件
    //由中间件authMiddleware处理，使用生成token并存放在header上的形式
    try {
        // 获取请求数据：req.user
        const { email } = req.user
        // 验证请求数据：
        //  1.接口请求验证 （x）
        //  2.email验证用户是否存在
        // console.log(email)
        // console.log("1-----------------------")
        const user = await User.findByPk(email)
        // console.log(user)
        if (!user) {
            throw new HttpException(401, '用户不存在', 'User is not found')
        }

        // 返回数据
        // 去除password字段
        // console.log("2-----------------------")
        delete user.dataValues.password
        //     添加token
        user.dataValues.token = req.token
        //     返回用户数据
        return res.status(200)
            .json({
                status: 1,
                message: '请求用户信息成功',
                data: user.dataValues
            })
    } catch (error) {
        next(error)
    }
}

//更改用户信息
module.exports.updateUser = async (req, res,next) => {
    try {
        // 1.验证接口权限  (中间件已经验证过)
        // 2.获取请求数据   req.email
        const { email } = req.user
        // 3.验证请求数据   email 验证用户是否存在
        const user = await User.findByPk(email)
        if (!user) {
            throw new HttpException(401, '用户不存在', 'User is not found')
        }
        // 4.修改用户数据
        //   1)获取请求数据   body 数据 =>更新的信息
        const bodyUser = req.body.user
        if (bodyUser) {
            //   2)数据字段判断
            const username = bodyUser.username ? bodyUser.username : user.username
            const bio = bodyUser.bio ? bodyUser.bio : user.bio
            const avatar = bodyUser.avatar ? bodyUser.avatar : user.avatar
            
            //   3)password更新  加密
            var password=user.password
             if(bodyUser.password){
                 password=await md5Password(bodyUser.password)
                //  console.log('password','---------------------')
             }
            //  1148bfa5436bce26920cc13329853287
            // aba638edcce6c07434844588af05d4ac
            //   4)更新操作
            const updateUser=await user.update({username,password,avatar,bio})
            // console.log({password})
            // console.log(updateUser.password)
            // 5.返回数据 
            //   1)去除password
            delete updateUser.dataValues.password
            //   2)添加token  新的token，更新过的
            updateUser.dataValues.token=await sign(updateUser)
            //   3)返回用户数据  
            return res.status(200)
            .json({
                status: 1,
                message: '更新用户信息成功',
                data:updateUser.dataValues
            })
        } else {
            throw new HttpException(401, "更新数据不能为空", "Update body is null")
        }

    } catch (error) {
        next(error)
    }
}



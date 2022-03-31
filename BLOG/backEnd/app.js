require('dotenv').config({path:'.env'})

const initDB =require('./src/init/initDB.js')
const initServer=require('./src/init/initServer')
const initRoute=require('./src/init/initRoute')

//中间件--解决跨域
const cors=require('cors')
const morgan=require('morgan')

const noMatchMiddleware =require('./src/middleware/404.middleware')
const errorMatchMiddleware =require('./src/middleware/error.middleware')


const express=require('express')
const app=express()

app.use(cors({credentials:true,origin:true}))   //跨域
app.use(express.json()) //解析数据
app.use(morgan('tiny'))//http请求日志

//静态服务
app.use('/static',express.static('public'))


//初始化路由
initRoute(app)

//404
app.use(noMatchMiddleware)
//
app.use(errorMatchMiddleware)


const main=async()=>{
    //初始化数据库服务
    await initDB()
    //再启动服务器
    await initServer(app)
}

main()
const sequelize=require('./sequelize.js')

const dbConnection =async ()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            await sequelize.authenticate();//测试数据库连接成功与否
            console.log('Connection mysql has been established successfully')
            resolve()
        }catch(error){
            console.log('Unable to connect to the database',error)
            reject()
        }
    })
}

module.exports=dbConnection

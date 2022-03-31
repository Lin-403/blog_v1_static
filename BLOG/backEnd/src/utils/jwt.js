require('dotenv').config({path:'../../.env'})

const jwt=require('jsonwebtoken')
// console.log(process.env.JWT_SECRET)

//加签=》token 服务端签发令牌，发给客户端使用

const sign=async (user)=>{
    return new Promise((resolve,reject)=>{
        jwt.sign({
            username:user.username,
            email:user.email
        },process.env.JWT_SECRET,(err,token)=>{
            if(err){
                return reject(err)
            }
            resolve(token)
        })
    })
}


//解签=》验证
const decode=async (token)=>{
    return new Promise((resolve,reject)=>{
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                return reject(err)
            }
            // console.log('111111111111',decoded)
            resolve(decoded)
        })
    })
}

module.exports={sign,decode}


// const test=async()=>{
//     const data={
//         username:'admin',
//         email:'admin@qq.com'
//     }
//     const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDgwMzg5MDl9.W_kN1CdKZDr9DMUWokrjqxErFamH8b-KIhgSdQZkaPE'
//     console.log(token)
//     // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBxcS5jb20iLCJpYXQiOjE2NDc5MzcwODl9.F2Ck9hMG1Dyb6kyOAG5e8o2AiPbn5tYNcE44q4u56Hs
//     const decoded=await decode(token)
//     console.log(decoded)
//     // { username: 'admin', email: 'admin@qq.com', iat: 1647937089 }
//     // iat: 1647937089 发布时间
// }
// test()



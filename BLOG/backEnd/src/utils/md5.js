
const md5=require('md5')

const SALT='tang'

const md5Password=(password)=>{
    return new Promise((resolve,reject)=>{
        const md5PWD=md5(password+SALT)
        resolve(md5PWD)
    })
}

//oldMd5Pwd是数据库中存储的密码
const matchPassword=(oldMd5Pwd,password)=>{
    return new Promise((resolve,reject)=>{
        //由用户输入加密而成的新的密码
        const newMd5PWD=md5(password+SALT)
        // console.log(oldMd5Pwd,'===',newMd5PWD)
        //判断是否相等----相等则密码正确
        if(oldMd5Pwd===newMd5PWD){
            resolve(true)
        }
        else{
           resolve(false)
        }
    })
}

module.exports={md5Password,matchPassword}

// async function test(){
//     const password='123'
//     const md5Pwd=await md5Password(password)
//     // console.log('md5Pwd:',md5Pwd)
//     // d07517506fa960346b878db95ad28047

//     const match=await matchPassword('d07517506fa960346b878db95ad28047','123')
//     // console.log(match)
// }

// test()
const bcrypt=require('bcrypt')

const SALT_ROUNDS=10

const hashPassword=(password)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.hash(password,SALT_ROUNDS,(err,encrypted)=>{
            if(err){
                reject(err)
            }
            resolve(encrypted)
        })
    })
}

const matchPassword=(oldHashPwd,password)=>{
    return new Promise(async (resolve,reject)=>{
        const match=await bcrypt.compare(password,oldHashPwd)
        console.log(match)
    })
}

async function test1(){
    const password='abc'
    const hashPwd=await hashPassword(password)
    console.log('hashPwd:',hashPwd)
    await matchPassword(hashPwd,'abc')
}

test1()

//创建用户时的校验

const validator=require('validator')

//验证：文章创建验证
module.exports.validateCreateUser=(title,description,body,tags)=>{
    let error={}

    if(validator.isEmpty(title)){
        error.title='文章标题不能为空'
    }
    if(validator.isEmpty(description)){
        error.description='文章描述不能为空'
    }
    if(validator.isEmpty(body)){
        error.body='文章内容不能为空'
    }
    // if(validator.isEmpty(tags)){
    //     error.tags='文章标签不能为空'
    // }
   
    let validate=Object.keys(error).length<1 //true-》验证通过  false-》验证失败

    return {error,validate}

}


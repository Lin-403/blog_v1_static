const {DataTypes}=require('sequelize')
const sequelize=require('../db/sequelize')

const Comment=sequelize.define('comment',{
   
    body:{  //内容
        type:DataTypes.TEXT,
    }
})

module.exports=Comment
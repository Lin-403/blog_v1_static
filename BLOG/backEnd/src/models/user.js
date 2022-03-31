const {DataTypes}=require('sequelize')
const sequelize=require('../db/sequelize')

const User=sequelize.define('user',{
    email:{  //邮箱
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:'username'
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    avatar:{  //头像
        type:DataTypes.TEXT,
        allowNull:true
    },
    bio:{ //简介
        type:DataTypes.TEXT,
        allowNull:true
    }
})

module.exports=User
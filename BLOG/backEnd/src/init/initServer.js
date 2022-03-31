require('dotenv').config({path:'../env'})


const initServer=async(app)=>{
    return new Promise((resolve,reject)=>{
     const PORT=process.env.PORT||8080
     app
     .listen(PORT,()=>{
         console.log(`Server is running on http://${process.env.HOST}:${PORT}`)
         resolve()
     })
     .on('error',(error)=>{
         console.log(error)
         reject()
     })
    })
     
 }

 module.exports=initServer
class HttpException extends Error{
    constructor(status,message,errors){
        super()
        // 实例化
        this.status=status
        this.message=message
        this.errors=errors
    }
}

module.exports=HttpException
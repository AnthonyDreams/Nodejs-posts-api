const s3 = require('../../s3');
class Image {
    
    static jsClass = false


    static save(arg, arg2){
        if(!arg){
            throw('Image is Empty')
        }
        if(Array.isArray(arg)){
            return s3.uploadFiles(arg)
        }
        return s3.uploadFile(arg)

    }
    
}


module.exports = Image;
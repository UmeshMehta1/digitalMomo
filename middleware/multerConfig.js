const multer= require("multer")

const storage= multer.diskStorage({
    destination: function(req,file,cb){
        //check the mimetype of file
        const allowedFileTypes=['image/png','image/jpg','image/jpeg']
        if(!allowedFileTypes.includes(file.mimetype)){
            return cb(new Error('Invalid File Type!'))
        }
        cb(null,'./uploads')// cb(error,success)=auta matra argument>
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
})

module.exports={
    multer,
    storage
}
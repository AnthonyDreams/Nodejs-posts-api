const AWS = require('./aws');
const s3 = new AWS.S3();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const FileType = require('file-type');
const readChunk = require('read-chunk');


exports.uploadFile = async (file, fileName = null) => {
    // Read content from the file
    
    const fileContent = fs.readFileSync(file);
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(file)[1]; 

    let fileName_ = fileName ? fileName() : file 
    let fileType = await FileType.fromBuffer(fileContent)

    const params = {
        Bucket: 'feedtesting',
        Key: fileName_,
        Body: fileContent,
        ContentType: fileType.mime,
        ACL: 'public-read'
    };



    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
                // to delete the file from our local

            fs.unlink(file,function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully');
        }); 
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        
    });

    

    return fileName_
};



exports.uploadFiles = async (files, fileName) => {
    // Read content from the file
    let filesName = []

     for(let file of files){
        await this.filesName.push(this.uploadFile(file, fileName()))
    }


    return filesName


};
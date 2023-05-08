const AWS = require('aws-sdk');

async function uploadToS3(fileData, fileName){
    const BUCKET_NAME = "expensetracking-abhay";
    const USER_ACCESS_KEY = "AKIAYXSCVMEKSN2TGNOB";
    const USER_SECRET_KEY = "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";

    const s3bucket = new AWS.S3({
        accessKeyId : USER_ACCESS_KEY,
        secretAccessKey : USER_SECRET_KEY
    });

    var params = {
        Bucket : BUCKET_NAME,
        Key : fileName,
        Body : fileData,
        ACL:"public-read"
    }
    return new Promise( (resolve, reject) => {

        s3bucket.upload(params , (err , s3Response) => {
            if(err) reject("Upload failed : ",err)
            else {
                console.log("Succesfully uploaded : ",s3Response);
                resolve(s3Response.Location);
            }
        });
    })
};

module.exports = uploadToS3;
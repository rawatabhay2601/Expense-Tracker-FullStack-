const AWS = require('aws-sdk');
require('dotenv').config();

async function uploadToS3(fileData, fileName){
    const accessKeyId = process.env.USER_ACCESS_KEY;
    const secretAccessKey = process.env.USER_SECRET_KEY;

    const s3bucket = new AWS.S3({
        accessKeyId : process.env.USER_ACCESS_KEY,
        secretAccessKey : process.env.USER_SECRET_KEY
    });

    var params = {
        Bucket : process.env.BUCKET_NAME,
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
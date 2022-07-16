const fs = require('fs');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const compressing = require('compressing');

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.generateFile = function(req,res){
    console.log("create file: " + req.params.name);
    fs.writeFile(req.params.name + ".json", 'Learn Node FS module', function (err) {
        if (err) throw err;

        Compress(req.params.name);


        console.log('File is created successfully.');
        // const params = {
        //     Bucket: process.env.S3_BUCKET,
        //     Key: req.params.name,
        //     Body: "Upload to AWS"
        // };
        // s3.upload(params, function(err, data) {
        //     console.log(err, data);
        //     const deleteParams = {
        //         Bucket: process.env.S3_BUCKET,
        //         Key: req.params.name
        //     };
        //     s3.deleteObject(deleteParams,(err,data)=>{
        //         console.log(err, data);
        //     });
        // });

        res.send("Uploaded to AWS");
    });
}

function Compress(fileName){
    // compress a file
    compressing.gzip.compressFile(fileName + ".json", req.params.name + ".gz")
        .then(console.log('Compression done'))
        .catch(err => console.log(err));
}
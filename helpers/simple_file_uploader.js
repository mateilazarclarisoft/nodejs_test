var fs = require('fs');
var stream = require('stream');
const tar = require('tar');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const compressing = require('compressing');
const { rejects } = require('assert');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


exports.process = (formattedDate, type, data) => {
    return new Promise((resolve,reject)=>{
        createFile(formattedDate,type, data)
            .then(() => {
                compress(formattedDate,type)
                    .then(() => {
                        uploadFile(`tmp/${formattedDate}_${type}.tgz`, `${type}/${formattedDate}.tgz`)
                            .then(() => {
                                deleteFile(formattedDate,type);
                                deleteFolder(formattedDate);
                                resolve("Finished processing")
                            }) 
                            .catch(error => {
                                reject(error)
                            })                     
                        })
                    .catch(error => {
                        reject(error)
                    })
            })
            .catch(error => {
                return reject(error);
            })
    })   
}


function createFile(formattedDate, type, data) {
    const stream = fs.createWriteStream(`tmp/${formattedDate}/${type}.json`);
    stream.on('error', (error) => {
        console.log(`An error occured while writing to the file ${type}.json. Error: ${error.message}`);
    });
    stream.write(data);
    return new Promise((resolve,reject) => {
        try{
            stream.end();
            stream.on('finish', () => {
                resolve(`All your documents have been written to ${type}.json`);
            })
        }
        catch(error){
            reject(error);
        }        
    })
}

function uploadFile(filePath, key){
    return new Promise((resolve,reject)=>{
        const fileContent = fs.readFileSync(filePath)

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: fileContent
        }

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve("Uploaded successfully")
        })
    }) 
}

function upload (filePath, key) {
    const inputStream = fs.createReadStream(filePath);
    inputStream
        .pipe(uploadFromStream(s3,key))
}

function uploadFromStream(s3,key) {
    var pass = stream.PassThrough();

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: pass
    };

    s3.upload(params, function (err, data) {
        console.log(err, data);
    })

    return pass;
}

function compress(formattedDate,type) {
    return new Promise((resolve) => {
        tar.c(
            {
                gzip: true,
                cwd: `tmp/${formattedDate}`
            },
            [`${type}.json`],
        ).pipe(fs.createWriteStream(`tmp/${formattedDate}_${type}.tgz`))
            .on('finish', function () {
                console.log("Finished compressing.")
                resolve()
            });
    })
}

function deleteFile(formattedDate,type) {
    fs.unlinkSync(`tmp/${formattedDate}/${type}.json`);
    fs.unlinkSync(`tmp/${formattedDate}_${type}.tgz`);
}

function deleteFolder(formattedDate){
    fs.rmdirSync(`tmp/${formattedDate}`,{ recursive: true, force: true });
}

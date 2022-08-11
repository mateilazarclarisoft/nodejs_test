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


exports.process = async(date, type, cursor) => {
    return new Promise(async (resolve,reject)=>{
        const formattedDate = formatDate(date)

        var fs = require('fs');
        var dir = `tmp/${formattedDate}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }

        const stream = createFile(formattedDate,type)
        let count = 0;   
        await cursor.eachAsync(async function (doc) {
            if (count>0) {
                stream.write(",");
            }    
            stream.write(JSON.stringify(doc));
            count++;
        }).then(() => {
            endFile(stream,`${formattedDate}/${type}.json`)
            .then(()=>{
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
        })
    }) 
}

function createFile(formattedDate, type) {
    const stream = fs.createWriteStream(`tmp/${formattedDate}/${type}.json`);
    stream.on('error', (error) => {
        console.log(`An error occured while writing to the file ${type}.json. Error: ${error.message}`);
    });
    stream.write("[");
    return stream;    
}

function endFile(stream, fileName) {
    return new Promise((resolve,reject) => {
        try{
            stream.write("]");
            stream.end();
            stream.on('finish', () => {
                resolve(`All your documents have been written to ${fileName}.json`);
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
    fs.rmSync(`tmp/${formattedDate}`,{ recursive: true, force: true });
}


function formatDate(date = new Date()) {
    if (typeof date === "string"){
        return date.substring(0,10).replace(/-/g,'');
    } else {
        return [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('');
    }

}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
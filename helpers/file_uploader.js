var fs = require('fs');
var stream = require('stream');
const tar = require('tar');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

const mongoose = require('mongoose');
const db = require("../models/db");
const serviceAppointmentTrack = db.serviceappointmenttracks;

dotenv.config();

const compressing = require('compressing');
const { rejects } = require('assert');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


exports.process = async (cursor, type, formattedDate) => {
    const typeStream = createFile(type, formattedDate, type);
    let typeCount = 0;

    const bigDataTransactionsStream = createFile(type, formattedDate, "bigdatatransactions");
    let bigDataTransactionsCount = 0;

    const applicationServerOnArriveItemsStream = createFile(type, formattedDate, "applicationserveronarriveitems");
    let applicationServerOnArriveItemsCount = 0;

    const applicationServerOnLeaveItemsStream = createFile(type, formattedDate, "applicationserveronleaveitems");
    let applicationServerOnLeaveItemsCount = 0;

    const dmsOnArriveItemsStream = createFile(type, formattedDate, "dmsonarriveitems");
    let dmsOnArriveItemsCount = 0;

    const dmsOnLeavingItemsStream = createFile(type, formattedDate, "dmsonleavingitems");
    let dmsOnLeavingItemsCount = 0;

    const rtdOnArriveItemsStream = createFile(type, formattedDate, "rtdonarriveitems");
    let rtdOnArriveItemsCount = 0;

    const rtdOnLeavingItemsStream = createFile(type, formattedDate, "rtdonleavingitems");
    let rtdOnLeavingItemsCount = 0;

    let typeTracks = [];
    let bigdatatransactions = [];
    let applicationserveronarriveitems = [];
    let applicationserveronleaveitems = [];
    let dmsonarriveitems = [];
    let dmsonleavingitems = [];
    let rtdonarriveitems = [];
    let rtdonleavingitems = [];

    while (await cursor.hasNext()) {
        const doc = await cursor.next();
        doc.bigdatatransactions.forEach(
            item => {
                bigDataTransactionsCount = addItem(
                    bigDataTransactionsStream, bigDataTransactionsCount, bigdatatransactions, item);
            });

        doc.applicationserveronarriveitems.forEach(
            item => {
                applicationServerOnArriveItemsCount = addItem(
                    applicationServerOnArriveItemsStream, applicationServerOnArriveItemsCount, applicationserveronarriveitems, item);
            });

        doc.applicationserveronleaveitems.forEach(
            item => {
                applicationServerOnLeaveItemsCount = addItem(
                    applicationServerOnLeaveItemsStream, applicationServerOnLeaveItemsCount, applicationserveronleaveitems, item);
            });

        doc.dmsonarriveitems.forEach(
            item => {
                dmsOnArriveItemsCount = addItem(
                    dmsOnArriveItemsStream, dmsOnArriveItemsCount, dmsonarriveitems, item);
            });

        doc.dmsonleavingitems.forEach(
            item => {
                dmsOnLeavingItemsCount = addItem(
                    dmsOnLeavingItemsStream, dmsOnLeavingItemsCount, dmsonleavingitems, item);
            });

        doc.rtdonarriveitems.forEach(
            item => {
                rtdOnArriveItemsCount = addItem(
                    rtdOnArriveItemsStream, rtdOnArriveItemsCount, rtdonarriveitems, item);
            });

        doc.rtdonleavingitems.forEach(
            item => {
                rtdOnLeavingItemsCount = addItem(
                    rtdOnLeavingItemsStream, rtdOnLeavingItemsCount, rtdonleavingitems, item);
            });

        delete doc.bigdatatransactions;
        delete doc.applicationserveronarriveitems;
        delete doc.applicationserveronleaveitems;
        delete doc.dmsonarriveitems;
        delete doc.dmsonleavingitems;
        delete doc.rtdonarriveitems;
        delete doc.rtdonleavingitems;

        typeCount = addItem(
            typeStream, typeCount, typeTracks, doc);
    }



    const dataPromises = []
    dataPromises.push(endFile(typeStream, type));
    dataPromises.push(endFile(bigDataTransactionsStream, "bigdatatransactions"));
    dataPromises.push(endFile(applicationServerOnArriveItemsStream, "applicationserveronarriveitems"));
    dataPromises.push(endFile(applicationServerOnLeaveItemsStream, "applicationserveronleaveitems"));
    dataPromises.push(endFile(dmsOnArriveItemsStream, "dmsonarriveitems"));
    dataPromises.push(endFile(dmsOnLeavingItemsStream, "dmsonleavingitems"));
    dataPromises.push(endFile(rtdOnArriveItemsStream, "rtdonarriveitems"));
    dataPromises.push(endFile(rtdOnLeavingItemsStream, "rtdonleavingitems"));

    const fileNames = [];
    fileNames.push(`${type}.json`);
    fileNames.push("bigdatatransactions.json");
    fileNames.push("applicationserveronarriveitems.json");
    fileNames.push("applicationserveronleaveitems.json");
    fileNames.push("dmsonarriveitems.json");
    fileNames.push("dmsonleavingitems.json");
    fileNames.push("rtdonarriveitems.json");
    fileNames.push("rtdonleavingitems.json");

    await Promise.all(dataPromises)

    await compress(type,formattedDate, fileNames)
    
    result = await uploadFile(`tmp/${type}_${formattedDate}.tgz`, `${type}/${formattedDate}.tgz`)
    console.log(result);
    
    deleteFiles(type,formattedDate,fileNames);
    deleteFolder(type,formattedDate);
    return Promise.resolve("Finished processing")
    
}


exports.processJoin = async (cursor,type,formattedDate,joinTable) => {
    const joinTableStream = createFile(type, formattedDate, joinTable);
    let joinTableCount = 0;
    let jointTableItems = [];

    while (await cursor.hasNext()) {
        const doc = await cursor.next();
        
        doc.dmsonarriveitems.forEach(
            item => {
                joinTableCount = addItem(
                    joinTableStream, joinTableCount, jointTableItems, item);
            });
    }



    const dataPromises = []
    dataPromises.push(endFile(joinTableStream, type));

    const fileNames = [];
    fileNames.push(`${joinTable}.json`);

    await Promise.all(dataPromises)

    await compress(type,formattedDate, fileNames)
    
    result = await uploadFile(`tmp/${type}_${joinTable}_${formattedDate}.tgz`, `${type}/${formattedDate}.tgz`)
    console.log(result);
    
    deleteFiles(type,formattedDate,fileNames);
    deleteFolder(type,formattedDate);
    return Promise.resolve("Finished processing")
    
}


function createFile(type, formattedDate, fileName) {
    const stream = fs.createWriteStream(`tmp/${type}/${formattedDate}/${fileName}.json`);
    stream.on('error', (error) => {
        console.log(`An error occured while writing to the file ${fileName}.json. Error: ${error.message}`);
    });
    stream.write("[");
    return stream;
}

function addItem(stream, streamCount, list, item) {
    // list.push(item._id);
    if (streamCount > 0) {
        stream.write(",");
    }
    stream.write(JSON.stringify(item));
    streamCount++;
    return streamCount;
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

function compress(type,formattedDate,fileNames) {
    return new Promise((resolve) => {
        tar.c(
            {
                gzip: true,
                cwd: `tmp/${type}/${formattedDate}`
            },
            fileNames
        ).pipe(fs.createWriteStream(`tmp/${type}_${formattedDate}.tgz`))
            .on('finish', function () {
                console.log("Finished compressing.")
                resolve()
            });
    })
}

function deleteFiles(type,formattedDate,fileNames) {
    fileNames.forEach(fileName => {
        fs.unlinkSync(`tmp/${type}/${formattedDate}/${fileName}`);
    });
    fs.unlinkSync(`tmp/${type}_${formattedDate}.tgz`);
}

function deleteFolder(type,formattedDate){
    fs.rmdirSync(`tmp/${type}/${formattedDate}`,{ recursive: true, force: true });
}

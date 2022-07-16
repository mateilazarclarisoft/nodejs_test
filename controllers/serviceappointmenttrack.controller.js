const mongoose = require('mongoose');
const db = require("../models/db");
const serviceAppointmentTrack = db.serviceappointmenttracks;
const fs = require('fs');

// Retrieve all ServiceAppointmentTracks from the database.
exports.findAll = async (req, res) => {
    let queryDate = new Date(
        +req.params.year,
        +req.params.month - 1,
        +req.params.day
    );

    var ObjectId = require('mongoose').Types.ObjectId;
    var start = new Date(queryDate.setUTCHours(0, 0, 0, 0));
    var end = new Date(queryDate.setUTCHours(23, 59, 59, 999));

    const cursor = serviceAppointmentTrack.aggregate([
        {
            $match: {"latestOperationDate": {$gte: start, $lte: end}}
        },
        {
            $lookup:
                {
                    from: "bigdatatransactions",
                    localField: "transactions",
                    foreignField: "_id",
                    as: "bigdatatransactions"
                }
        },
        {
            $lookup:
                {
                    from: "applicationserveronarriveitems",
                    localField: "bigdatatransactions.ApplicationServerOnArrive",
                    foreignField: "_id",
                    as: "applicationserveronarriveitems"
                }
        },
        {
            $lookup:
                {
                    from: "applicationserveronleavingitems",
                    localField: "bigdatatransactions.ApplicationServerOnLeave",
                    foreignField: "_id",
                    as: "applicationserveronleaveitems"
                }
        },
        {
            $lookup:
                {
                    from: "dmsonarriveitems",
                    localField: "bigdatatransactions.DMSOnArrive",
                    foreignField: "_id",
                    as: "dmsonarriveitems"
                }
        },
        {
            $lookup:
                {
                    from: "dmsonleavingitems",
                    localField: "bigdatatransactions.DMSOnLeave",
                    foreignField: "_id",
                    as: "dmsonleavingitems"
                }
        },
        {
            $lookup:
                {
                    from: "rtdonarriveitems",
                    localField: "bigdatatransactions.RTDOnArrive",
                    foreignField: "_id",
                    as: "rtdonarriveitems"
                }
        },
        {
            $lookup:
                {
                    from: "rtdonleavingitems",
                    localField: "bigdatatransactions.RTDOnLeave",
                    foreignField: "_id",
                    as: "rtdonleavingitems"
                }
        },
        {
            $limit: 5
        }
    ]).cursor({batchSize: 1}).exec();

    const serviceAppointmentsTracksStream = createFile("serviceappointmentstracks");
    let serviceAppointmentsTracksCount = 0;

    const bigDataTransactionsStream = createFile("bigdatatransactions");
    let bigDataTransactionsCount = 0;

    const applicationServerOnArriveItemsStream = createFile("applicationserveronarriveitems");
    let applicationServerOnArriveItemsCount = 0;

    const applicationServerOnLeaveItemsStream = createFile("applicationserveronleaveitems");
    let applicationServerOnLeaveItemsCount = 0;

    const dmsOnArriveItemsStream = createFile("dmsonarriveitems");
    let dmsOnArriveItemsCount = 0;

    const dmsOnLeavingItemsStream = createFile("dmsonleavingitems");
    let dmsOnLeavingItemsCount = 0;

    const rtdOnArriveItemsStream = createFile("rtdonarriveitems");
    let rtdOnArriveItemsCount = 0;

    const rtdOnLeavingItemsStream = createFile("rtdonleavingitems");
    let rtdOnLeavingItemsCount = 0;

    let serviceappointmentstracks = [];
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
            item=>{
                bigDataTransactionsCount = addItem(
                    bigDataTransactionsStream,bigDataTransactionsCount,bigdatatransactions,item);
            });

        doc.applicationserveronarriveitems.forEach(
            item=>{
                applicationServerOnArriveItemsCount = addItem(
                    applicationServerOnArriveItemsStream,applicationServerOnArriveItemsCount,applicationserveronarriveitems,item);
            });

        doc.applicationserveronleaveitems.forEach(
            item=>{
                applicationServerOnLeaveItemsCount = addItem(
                    applicationServerOnLeaveItemsStream,applicationServerOnLeaveItemsCount,applicationserveronleaveitems,item);
            });

        doc.dmsonarriveitems.forEach(
            item=>{
                dmsOnArriveItemsCount = addItem(
                    dmsOnArriveItemsStream,dmsOnArriveItemsCount,dmsonarriveitems,item);
            });

        doc.dmsonleavingitems.forEach(
            item=>{
                dmsOnLeavingItemsCount = addItem(
                    dmsOnLeavingItemsStream,dmsOnLeavingItemsCount,dmsonleavingitems,item);
            });

        doc.rtdonarriveitems.forEach(
            item=>{
                rtdOnArriveItemsCount = addItem(
                    rtdOnArriveItemsStream,rtdOnArriveItemsCount,rtdonarriveitems,item);
            });

        doc.rtdonleavingitems.forEach(
            item=>{
                rtdOnLeavingItemsCount = addItem(
                    rtdOnLeavingItemsStream,rtdOnLeavingItemsCount,rtdonleavingitems,item);
            });

        delete doc.bigdatatransactions;
        delete doc.applicationserveronarriveitems;
        delete doc.applicationserveronleaveitems;
        delete doc.dmsonarriveitems;
        delete doc.dmsonleavingitems;
        delete doc.rtdonarriveitems;
        delete doc.rtdonleavingitems;

        serviceAppointmentsTracksCount = addItem(
            serviceAppointmentsTracksStream,serviceAppointmentsTracksCount,serviceappointmentstracks,doc);
    }

    endFile(serviceAppointmentsTracksStream,"serviceappointmentstracks");
    endFile(bigDataTransactionsStream,"bigdatatransactions")
    endFile(applicationServerOnArriveItemsStream,"applicationserveronarriveitems");
    endFile(applicationServerOnLeaveItemsStream,"applicationserveronleaveitems");
    endFile(dmsOnArriveItemsStream,"dmsonarriveitems");
    endFile(dmsOnLeavingItemsStream,"dmsonleavingitems");
    endFile(rtdOnArriveItemsStream,"rtdonarriveitems");
    endFile(rtdOnLeavingItemsStream,"rtdonleavingitems");

    res.send(
        {
            serviceappointmentstracks: serviceappointmentstracks,
            bigdatatransactions: bigdatatransactions,
            applicationserveronarriveitems: applicationserveronarriveitems,
            applicationserveronleaveitems: applicationserveronleaveitems,
            dmsonarriveitems: dmsonarriveitems,
            dmsonleavingitems: dmsonleavingitems,
            rtdonarriveitems: rtdonarriveitems,
            rtdonleavingitems: rtdonleavingitems,
        });
};

function createFile(filePath)
{
    const stream = fs.createWriteStream(filePath+".json");
    stream.on('error',  (error) => {
        console.log(`An error occured while writing to the file ${filePath}.json. Error: ${error.message}`);
    });
    stream.write("[");
    return stream;
}

function addItem(stream,streamCount,list,item)
{
    list.push(item);
    if (streamCount>0){
        stream.write(",");
    }
    stream.write(JSON.stringify(item));
    streamCount++;
    return streamCount;
}

function endFile(stream,filePath)
{
    stream.write("]");
    stream.end();
    stream.on('finish', () => {
        console.log(`All your sentences have been written to ${filePath}.json`);
    })
}


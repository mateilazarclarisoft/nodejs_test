const db = require("../models/db");
const dmsonleavingitems = db.dmsonleavingitems;

const fileUploader = require("../helpers/file_uploader");
let processing = false;

// Retrieve all dmsonleavingitems from the database.
exports.export = async (req, res) => {
    if (!processing) {
        processing = true;
        const start = Date.now();
        dmsonleavingitems.getMinimumDate().exec()
            .then(result => {
                const record = result.pop();
                const sixtyDays = 60*24*60*60*1000;

                let recordDate = dateObjectId.dateFromObjectId(record._id)
                if (Date.now() - recordDate > sixtyDays){
                    const start = new Date(recordDate.setUTCHours(0, 0, 0, 0));
                    const end = new Date(recordDate.setUTCHours(23, 59, 59, 999));

                    const startObjectId = dateObjectId.objectIdFromDate(start);
                    const endObjectId = dateObjectId.objectIdFromDate(end)

                    const cursor = dmsonleavingitems.getDocumentsByDate(startObjectId,endObjectId).cursor();
                    fileUploader.process(recordDate, 'dmsonleavingitems', cursor)
                        .then((result) => {
                            dmsonleavingitems.cleanup(startObjectId,endObjectId)
                                .then(result=>{
                                    console.log(`Time taken: ${Date.now() - start}ms`);
                                    processing = false;
                                })
                                .catch(error => {
                                    res.status(500).send({message: error.message});
                                })
                        })
                        .catch(error => {
                            res.status(500).send({message: error.message});
                        })
                        .finally(() => {
                            res.send({message: "Finished processing"});
                        })
                } else {
                    processing = false;
                    res.status(500).send({message: "No data older than 60 days can be exported"});
                }
            })
    } else {
        res.status(500).send({message: "Already processing"});
    }
};


var dateFromObjectId = function (objectId) {
    var date = objectId.getTimestamp();
    return new Date(date);
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};
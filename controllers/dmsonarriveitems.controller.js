const db = require("../models/db");
const dmsonarriveitems = db.dmsonarriveitems;
const fileUploader = require("../helpers/file_uploader");
const dateObjectId = require("../helpers/date_objectid");
let processing = false;

// Retrieve all dmsonarriveitems from the database.
exports.export = async (req, res) => {
    if (!processing) {
        processing = true;
        const start = Date.now();
        dmsonarriveitems.getMinimumDate().exec()
            .then(result => {
                const record = result.pop();
                const sixtyDays = 60*24*60*60*1000;

                let recordDate = dateObjectId.dateFromObjectId(record._id)
                if (Date.now() - recordDate > sixtyDays){
                    const start = new Date(recordDate.setUTCHours(0, 0, 0, 0));
                    const end = new Date(recordDate.setUTCHours(23, 59, 59, 999));

                    const startObjectId = dateObjectId.objectIdFromDate(start);
                    const endObjectId = dateObjectId.objectIdFromDate(end)

                    const cursor = dmsonarriveitems.getDocumentsByDate(startObjectId,endObjectId).cursor();
                    fileUploader.process(record.latestOperationDate, 'dmsonarriveitems', cursor)
                        .then((result) => {
                            dmsonarriveitems.cleanup(startObjectId,endObjectId)
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
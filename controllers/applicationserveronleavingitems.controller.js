const db = require("../models/db");
const applicationServerOnLeavingItem = db.applicationserveronleavingitems;
const fileUploader = require("../helpers/file_uploader");
let processing = false;

// Retrieve oldest applicationserveronleavingitems records from the database, then export them to s3
exports.export = async (req, res) => {
    if (!processing) {
        processing = true;
        const start = Date.now();
        applicationServerOnLeavingItem.getMinimumDate().exec()
            .then(result => {
                const record = result.pop();
                const sixtyDays = 60*24*60*60*1000;
                if (Date.now() - new Date(record.internalTrackingID) > sixtyDays) {
                    const cursor = applicationServerOnLeavingItem.getDocumentsByDate(record.internalTrackingID).cursor();
                    fileUploader.process(record.internalTrackingID, 'applicationserveronleavingitems', cursor)
                        .then((result) => {
                            applicationServerOnLeavingItem.cleanup(record.internalTrackingID)
                                .then(result => {
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

exports.exportTest = async (req, res) => {
    if (!processing) {
        processing = true;
        const start = Date.now();
        const internalTrackingId = "2018-12-31T23:59:22.333Z";
        const sixtyDays = 60*24*60*60*1000;
        if (Date.now() - new Date(internalTrackingId) > sixtyDays) {
            const cursor = applicationServerOnLeavingItem.getDocumentsByDate(internalTrackingId).cursor();
            fileUploader.process(internalTrackingId, 'applicationserveronleavingitems', cursor)
                .then((result) => {
                    applicationServerOnLeavingItem.cleanup(internalTrackingId)
                        .then(result => {
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
    } else {
        res.status(500).send({message: "Already processing"});
    }
};
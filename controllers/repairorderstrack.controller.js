const db = require("../models/db");
const repairorderstracks = db.repairorderstracks;
const fileUploader = require("../helpers/file_uploader");
let processing = false;

exports.export = async (req, res) => {
    if (!processing) {
        processing = true;
        const start = Date.now();
        repairorderstracks.getMinimumDate().exec()
            .then(result => {
                const record = result.pop();
                const sixtyDays = 60*24*60*60*1000;
                if (Date.now() - record.latestOperationDate > sixtyDays){
                    const cursor = repairorderstracks.getDocumentsByDate(record.latestOperationDate).cursor();
                    fileUploader.process(record.latestOperationDate, 'repairorderstracks', cursor)
                        .then((result) => {
                            repairorderstracks.cleanup(record.latestOperationDate)
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
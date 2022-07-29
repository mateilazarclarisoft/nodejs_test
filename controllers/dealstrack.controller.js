const mongoose = require('mongoose');
const db = require("../models/db");
const dealsTrack = db.dealstracks;
const fs = require('fs');
const fileUploader = require("../helpers/file_uploader");



// Retrieve all DealsTracks from the database.
exports.findAll = async (req, res) => {
    const start = Date.now();
    const queryDate = new Date(Date.UTC(
        +req.params.year,
        +req.params.month - 1,
        +req.params.day
    ));
    const formattedDate = `${req.params.year}${req.params.month}${req.params.day}`;
    var fs = require('fs');
    var dir = `tmp/dealstracks/${formattedDate}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    const cursor = dealsTrack.getDocumentsByDate(queryDate);
    
    result = await fileUploader.process(cursor,"dealstracks",formattedDate);
    console.log(result);
    const end = Date.now();
    const time =  Math.floor((end - start) / 1000)
    console.log(`Time: ${time} seconds`);
    res.send({"message":result,"time":time});
};



// Retrieve all DealsTracks from the database.
exports.export = async (req, res) => {
    const start = Date.now();
    const queryDate = new Date(Date.UTC(
        +req.params.year,
        +req.params.month - 1,
        +req.params.day
    ));
    const formattedDate = `${req.params.year}${req.params.month}${req.params.day}`;
    var fs = require('fs');
    var dir = `tmp/dealstracks/${formattedDate}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    const cursor = dealsTrack.getDocumentsByDate(queryDate);
    
    result = await fileUploader.process(cursor,"dealstracks",formattedDate);
    console.log(result);
    const end = Date.now();
    const time =  Math.floor((end - start) / 1000)
    console.log(`Time: ${time} seconds`);
    res.send({"message":result,"time":time});
};

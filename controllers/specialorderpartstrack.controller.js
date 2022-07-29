const mongoose = require('mongoose');
const db = require("../models/db");
const specialOrderPartsTrack = db.specialorderpartstracks;
const fs = require('fs');
const fileUploader = require("../helpers/file_uploader");

// Retrieve all DealsTracks from the database.
exports.findAll = async (req, res) => {
    const queryDate = new Date(Date.UTC(
        +req.params.year,
        +req.params.month - 1,
        +req.params.day
    ));
    const formattedDate = `${req.params.year}${req.params.month}${req.params.day}`;
    var fs = require('fs');
    var dir = `tmp/specialorderparts/${formattedDate}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    const cursor = specialOrderPartsTrack.getDocumentsByDate(queryDate);
    
    result = await fileUploader.process(cursor,"specialorderparts",formattedDate);
    console.log(result);
    res.send({"message":result});
};

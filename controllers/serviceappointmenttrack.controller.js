const mongoose = require('mongoose');
const db = require("../models/db");
const serviceAppointmentTrack = db.serviceappointmenttracks;
const fs = require('fs');
const fileUploader = require("../helpers/file_uploader");
const { rejects } = require('assert');

// Retrieve all ServiceAppointmentTracks from the database.
exports.findAll = async (req, res) => {
    const queryDate = new Date(Date.UTC(
        +req.params.year,
        +req.params.month - 1,
        +req.params.day
    ));
    const formattedDate = `${req.params.year}${req.params.month}${req.params.day}`;
    var fs = require('fs');
    var dir = `tmp/serviceappointmentstracks/${formattedDate}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    const cursor = serviceAppointmentTrack.getDocumentsByDate(queryDate);

    result = await fileUploader.process(cursor,"serviceappointmentstracks",formattedDate)
    console.log(result);
    res.send({"message":result});
 };

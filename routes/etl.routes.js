const express = require('express');
const router = express.Router();
const ServiceAppointmentTracksController = require("../controllers/serviceappointmenttrack.controller");
const FileController = require("../controllers/file.controller");

router.get("/serviceappointmenttracks/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", ServiceAppointmentTracksController.findAll);

router.get("/file/:name", FileController.generateFile);

module.exports = router;

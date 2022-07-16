const express = require('express');
const router = express.Router();
const ServiceAppointmentTracksController = require("../controllers/serviceappointmenttrack.controller");

/* GET serviceappointmenttracks listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/list", ServiceAppointmentTracksController.findAll);

module.exports = router;

const express = require('express');
const router = express.Router();
const ServiceAppointmentTracksController = require("../controllers/serviceappointmenttrack.controller");
const DealsTracksController = require("../controllers/dealstrack.controller");
const RepairOrdersTracksController = require("../controllers/repairorderstrack.controller");
const SpecialOrderPartsTracksController = require("../controllers/specialorderpartstrack.controller");
const ApplicationServerOnArriveItemsControllers = require("../controllers/applicationserveronarriveitems.controller");
const FileController = require("../controllers/file.controller");

router.get("/serviceappointmenttracks/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", ServiceAppointmentTracksController.findAll);
router.get("/dealstracks/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", DealsTracksController.findAll);
router.get("/repairorderstracks/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", RepairOrdersTracksController.findAll);
router.get("/specialorderpartstracks/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", SpecialOrderPartsTracksController.findAll);

router.get("/dealstracks/dmsonarriveitems/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", DealsTracksController.export);

router.get("/applicationserveronarriveitems/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", ApplicationServerOnArriveItemsControllers.findAll);

router.get("/file/:name", FileController.generateFile);

module.exports = router;

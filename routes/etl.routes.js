const express = require('express');
const router = express.Router();
const ApplicationServerOnArriveItemsController = require("../controllers/applicationserveronarriveitems.controller");
const ApplicationServerOnLeavingItemsController = require("../controllers/applicationserveronleavingitems.controller");
const BigDataTransactionsController = require("../controllers/bigdatatransactions.controller");
const DealsTracksController = require("../controllers/dealstracks.controller");
const DmsOnArriveItemsController = require("../controllers/dmsonarriveitems.controller")
const RepairsOrdersTracksController = require("../controllers/repairorderstrack.controller")
const RtdOnLeavingItemsController = require("../controllers/rtdonleavingitems.controller")
const ServiceAppointmentsTracksController = require("../controllers/serviceappointmenttrack.controller");
const SpecialOrderPartsTracksController = require("../controllers/specialorderpartstrack.controller");
const DmsOnLeavingItemsController = require("../controllers/dmsonleavingitems.controller")

// deprecated

// const DealsTracksController = require("../controllers/dealstrack.controller");
// const RepairOrdersTracksController = require("../controllers/repairorderstrack.controller");

// const FileController = require("../controllers/file.controller");

// router.get("/serviceappointmenttracks/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", ServiceAppointmentsTracksController.findAll);
// router.get("/dealstracks/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", DealsTracksController.findAll);
// router.get("/repairorderstracks/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", RepairOrdersTracksController.findAll);
// router.get("/specialorderpartstracks/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", SpecialOrderPartsTracksController.findAll);
// router.get("/dealstracks/dmsonarriveitems/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", DealsTracksController.export);
// router.get("/applicationserveronarriveitems/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})", ApplicationServerOnArriveItemsController.findAll);
// router.get("/file/:name", FileController.generateFile);

router.get("/applicationserveronarriveitems/export", ApplicationServerOnArriveItemsController.export);
router.get("/applicationserveronleavingitems/export", ApplicationServerOnLeavingItemsController.export);
router.get("/bigdatatransactions/export", BigDataTransactionsController.export);
router.get("/dealstracks/export", DealsTracksController.export);
router.get("/dmsonarriveitems/export", DmsOnArriveItemsController.export);
router.get("/dmsonleavingitems/export", DmsOnLeavingItemsController.export);
router.get("/repairsorderstracks/export", RepairsOrdersTracksController.export);
router.get("/rtdonleavingitems/export", RtdOnLeavingItemsController.export);
router.get("/serviceappointmentstracks/export", ServiceAppointmentsTracksController.export);
router.get("/specialorderpartstracks/export", SpecialOrderPartsTracksController.export);

module.exports = router;

const mongoose = require('mongoose');
const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true
};

mongoose.connect('mongodb://unotifi:tgY2h87BcLrsDNIYpgUV@52.205.225.113:27017/uNotifiBigData?authSource=admin',option,
err => {
    if (!err){
        console.log('Connection succeded')
    } else {
        console.log('Error in connection' +  err)
    }
})

const db = {};
db.mongoose = mongoose;
db.applicationserveronarriveitems = require('./applicationserveronarriveitem.model')(mongoose)
db.applicationserveronleavingitems = require('./applicationserveronleavingitem.model')(mongoose)
db.bigdatatransactions = require('./bigdatatransaction.model')(mongoose)
db.dmsonarriveitems = require('./dmsonarriveitem.model')(mongoose)
db.dmsonleavingitems = require('./dmsonleavingitem.model')(mongoose)
db.rtdonarriveitems = require('./rtdonarriveitem.model')(mongoose)
db.rtdonleavingitems = require('./rtdonleavingitem.model')(mongoose)
db.serviceappointmenttracks = require('./serviceappointmenttrack.model')(mongoose)
module.exports = db;

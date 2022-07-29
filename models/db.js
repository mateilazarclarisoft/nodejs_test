const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true
};

const connectionString = 
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/` + 
    `${process.env.DB_DATABASE}?authSource=admin`;

mongoose.Promise = global.Promise;
mongoose.connect(connectionString,option,
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
db.serviceappointmenttracks = require('./serviceappointmentstrack.model')(mongoose)
db.dealstracks = require('./dealstrack.model')(mongoose)
db.repairorderstracks = require('./repairorderstrack.model')(mongoose)
db.specialorderpartstracks = require('./specialorderpartstrack.model')(mongoose)
module.exports = db;

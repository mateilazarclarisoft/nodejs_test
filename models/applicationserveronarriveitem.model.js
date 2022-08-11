var mongo = require('mongodb');
module.exports = mongoose => {
    const schema = mongoose.Schema({
        internalTrackingID: String,
        receivedByApplicationServer : Date,
        onArrivalToTheSystem: {type: mongoose.Schema.Types.Mixed}
    });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const ApplicationServerOnArrive = mongoose.model("applicationserveronarriveitems", schema);

    ApplicationServerOnArrive.getDocumentsByDate = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.find({"receivedByApplicationServer": {$gte: start, $lte: end}});
        //return this.find({_id: {$in:[new mongo.ObjectID("5c2aad80819249660b3b959e"),new mongo.ObjectID("5c2aad80819249660b3b95a0")]} });
    }

    ApplicationServerOnArrive.getMinimumDate = function(){
        return this.find().sort({receivedByApplicationServer:1}).limit(1)
    }

    ApplicationServerOnArrive.cleanup = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.deleteMany({"receivedByApplicationServer": {$gte: start, $lte: end}});
    }

    return ApplicationServerOnArrive;
};
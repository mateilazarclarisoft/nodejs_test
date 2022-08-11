module.exports = mongoose => {
    const schema = mongoose.Schema({
        internalTrackingID: String,
        rtdRequest: {
            url: String,
            parameters: {}
        },
        rtdResponse: {},
        filePath: String,
        data: {}
    });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const DmsOnLeaving = mongoose.model("dmsonleavingitems", schema);

    DmsOnLeaving.getDocumentsByDate = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        var startObjectId = objectIdFromDate(start);
        var endObjectId = objectIdFromDate(end)
        return this.find({"_id": {$gte: startObjectId, $lte: endObjectId}});
    }

    DmsOnLeaving.getMinimumDate = function(){
        return this.find().sort({_id:1}).limit(1)
    }

    DmsOnLeaving.cleanup = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        var startObjectId = objectIdFromDate(start);
        var endObjectId = objectIdFromDate(end)

        return this.deleteMany({"_id": {$gte: startObjectId, $lte: endObjectId}});
    }

    return DmsOnLeaving;
};

var objectIdFromDate = function (date) {
    return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
};
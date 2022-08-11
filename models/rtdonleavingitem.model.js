module.exports = mongoose => {
    const schema = mongoose.Schema({
        internalTrackingID: String,
        receivedByRTD: Date,
        sentToSqs: Date,
        sqsRequest: {
            url: String,
            parameters: {}
        },
        sqsResponse: {},
        data: {}
    });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const RtdOnLeave = mongoose.model("rtdonleavingitems", schema);

    RtdOnLeave.getDocumentsByDate = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.find({"sentToSqs": {$gte: start, $lte: end}});
    }

    RtdOnLeave.getMinimumDate = function(){
        return this.find().sort({sentToSqs:1}).limit(1)
    }

    RtdOnLeave.cleanup = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.deleteMany({"sentToSqs": {$gte: start, $lte: end}});
    }
    
    return RtdOnLeave;
};
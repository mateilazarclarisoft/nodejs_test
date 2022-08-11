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

    const RtdOnArrive = mongoose.model("rtdonarriveitems", schema);

    RtdOnArrive.getMinimumDate = function(){
        return this.find().sort({_id:1}).limit(1)
    }

    RtdOnArrive.getDocumentsByDate = function(start,end){
        return this.find({"_id": {$gte: start, $lte: end}});
    }

    RtdOnArrive.cleanup = function(start,end){
        return this.deleteMany({"_id": {$gte: start, $lte: end}});
    }

    return RtdOnArrive;
};
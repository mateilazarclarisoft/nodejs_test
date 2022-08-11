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

    RtdOnLeave.getMinimumDate = function(){
        return this.find().sort({_id:1}).limit(1)
    }

    RtdOnLeave.getDocumentsByDate = function(start,end){
        return this.find({"_id": {$gte: start, $lte: end}});
    }

    RtdOnLeave.cleanup = function(start,end){
        return this.deleteMany({"_id": {$gte: start, $lte: end}});
    }
    
    return RtdOnLeave;
};
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

    DmsOnLeaving.getMinimumDate = function(){
        return this.find().sort({_id:1}).limit(1)
    }

    DmsOnLeaving.getDocumentsByDate = function(start,end){
        return this.find({"_id": {$gte: start, $lte: end}});
    }

    DmsOnLeaving.cleanup = function(start,end){
        return this.deleteMany({"_id": {$gte: start, $lte: end}});
    }

    return DmsOnLeaving;
};
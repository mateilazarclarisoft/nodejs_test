module.exports = mongoose => {
    const schema = mongoose.Schema({
        internalTrackingID: String,
        receivedByDMS : Date,
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

    const DmsOnArrive = mongoose.model("dmsonarriveitems", schema);

    DmsOnArrive.getMinimumDate = function(){
        return this.find().sort({_id:1}).limit(1)
    }

    DmsOnArrive.getDocumentsByDate = function(start,end){
        return this.find({"_id": {$gte: start, $lte: end}});
    }

    DmsOnArrive.cleanup = function(start,end){
        return this.deleteMany({"_id": {$gte: start, $lte: end}});
    }

    return DmsOnArrive;
};
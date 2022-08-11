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

    DmsOnArrive.getDocumentsByDate = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.find({"latestOperationDate": {$gte: start, $lte: end}});
    }

    DmsOnArrive.getMinimumDate = function(){
        return this.find().sort({latestOperationDate:1}).limit(1)
    }

    DmsOnArrive.cleanup = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.deleteMany({"latestOperationDate": {$gte: start, $lte: end}});
    }

    return DmsOnArrive;
};
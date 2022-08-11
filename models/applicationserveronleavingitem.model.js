module.exports = mongoose => {
    const schema = mongoose.Schema({
        internalTrackingID: String,
        onLeavingTheSystem: {type: mongoose.Schema.Types.Mixed}
    });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const ApplicationServerOnLeave = mongoose.model("applicationserveronleavingitems", schema);

    ApplicationServerOnLeave.getDocumentsByDate = function(date){
        var start = date.substring(0,11)+"00:00:00.000Z";
        var end = date.substring(0,11)+"23:59:59.999Z";

        return this.find({"internalTrackingID": {$gte: start, $lte: end}});
    }

    ApplicationServerOnLeave.getMinimumDate = function(){
        return this.find({"internalTrackingID" : {$gte: "2018-12-31T00:00:00.000Z"}}).sort({internalTrackingID:1}).limit(1)
    }

    ApplicationServerOnLeave.cleanup = function(date){
        var start = date.substring(0,11)+"00:00:00.000Z";
        var end = date.substring(0,11)+"23:59:59.999Z";

        return this.deleteMany({"internalTrackingID": {$gte: start, $lte: end}});
    }

    return ApplicationServerOnLeave;
};
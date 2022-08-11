module.exports = mongoose => {
    const schema = mongoose.Schema({
        internalTrackingId: {type: String, required: true},
        transactionId: String,
        operationDate: {type: Date, default: new Date()},
        dms: String,
        transactionType: String,
        itemId: String,

        latestError: {
            system: String,
            message: String
        },

        latestInfo: {
            system: String,
            message: String
        },

        // Tracking info
        DMSOnArrive: [{type: mongoose.Schema.Types.ObjectId, ref: (require('./dmsonarriveitem.model').modelName)}],
        DMSOnLeave: [{type: mongoose.Schema.Types.ObjectId, ref: (require('./dmsonleavingitem.model').modelName)}],

        RTDOnArrive: [{type: mongoose.Schema.Types.ObjectId, ref: (require('./rtdonarriveitem.model').modelName)}],
        RTDOnLeave: [{type: mongoose.Schema.Types.ObjectId, ref: (require('./rtdonleavingitem.model').modelName)}],

        ApplicationServerOnArrive: [{type: mongoose.Schema.Types.ObjectId, ref: (require('./applicationserveronarriveitem.model').modelName)}],
        ApplicationServerOnLeave: [{type: mongoose.Schema.Types.ObjectId, ref: (require('./applicationserveronleavingitem.model').modelName)}],
    });

    schema.index({internalTrackingId: 1, itemId: 1}, {name: "compound_1", background: true});

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const BigDataTransaction = mongoose.model("bigdatatransactions", schema);

    BigDataTransaction.getDocumentsByDate = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.find({"operationDate": {$gte: start, $lte: end}});
    }

    BigDataTransaction.getMinimumDate = function(){
        return this.find().sort({operationDate:1}).limit(1)
    }

    BigDataTransaction.cleanup = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.deleteMany({"operationDate": {$gte: start, $lte: end}});
    }
    
    return BigDataTransaction;
};
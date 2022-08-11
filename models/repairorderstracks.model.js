module.exports = mongoose => {
    const schema = mongoose.Schema({
        roNumber: String,
        vin: String,

        internalDealerCode: String,
        customerNumber: String,
        latestTransactionId: String,
        latestDms: String,
        latestTransactionType: String,
        latestOperationDate: {type: Date, default: new Date()},

        latestError: {
            system: String,
            message: String
        },

        latestInfo: {
            system: String,
            message: String
        },

        DMSArrived: {type: Boolean, default: false},
        DMSLeft: {type: Boolean, default: false},

        RTDArrived: {type: Boolean, default: false},
        RTDLeft: {type: Boolean, default: false},

        ApplicationServerArrived: {type: Boolean, default: false},
        ApplicationServerLeft: {type: Boolean, default: false},

        // Tracking info
        latestTransaction: {type: mongoose.Schema.Types.ObjectId, ref: (require('./bigdatatransaction.model').modelName)},
        transactions: [{type: mongoose.Schema.Types.ObjectId, ref: (require('./bigdatatransaction.model').modelName)}]
    });

    schema.index({latestOperationDate: -1, customerNumber: 1, internalDealerCode: 1, roNumber: 1}, {name: "compound_1", background: true});

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const RepairOrdersTrack = mongoose.model("repairorderstracks", schema);

    RepairOrdersTrack.getDocumentsByDate = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.find({"latestOperationDate": {$gte: start, $lte: end}});
    }

    RepairOrdersTrack.getMinimumDate = function(){
        return this.find().sort({latestOperationDate:1}).limit(1)
    }

    RepairOrdersTrack.cleanup = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.deleteMany({"latestOperationDate": {$gte: start, $lte: end}});
    }

    return RepairOrdersTrack;
};
module.exports = mongoose => {
    const schema = mongoose.Schema({
        specialOrderRepairNumber: String,

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

    schema.index({latestOperationDate: -1, customerNumber: 1, internalDealerCode: 1, specialOrderRepairNumber: 1}, {name: "compound_1", background: true});

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const SpecialOrderPartsTrack = mongoose.model("specialorderpartstracks", schema);
    SpecialOrderPartsTrack.getDocumentsByDate = function(date){
        var start = new Date(date.setUTCHours(0, 0, 0, 0));
        var end = new Date(date.setUTCHours(23, 59, 59, 999));

        return this.aggregate([
            {
                $match: {"latestOperationDate": {$gte: start, $lte: end}}
            },
            {
                $lookup:
                    {
                        from: "bigdatatransactions",
                        localField: "transactions",
                        foreignField: "_id",
                        as: "bigdatatransactions"
                    }
            },
            {
                $lookup:
                    {
                        from: "applicationserveronarriveitems",
                        localField: "bigdatatransactions.ApplicationServerOnArrive",
                        foreignField: "_id",
                        as: "applicationserveronarriveitems"
                    }
            },
            {
                $lookup:
                    {
                        from: "applicationserveronleavingitems",
                        localField: "bigdatatransactions.ApplicationServerOnLeave",
                        foreignField: "_id",
                        as: "applicationserveronleaveitems"
                    }
            },
            {
                $lookup:
                    {
                        from: "dmsonarriveitems",
                        localField: "bigdatatransactions.DMSOnArrive",
                        foreignField: "_id",
                        as: "dmsonarriveitems"
                    }
            },
            {
                $lookup:
                    {
                        from: "dmsonleavingitems",
                        localField: "bigdatatransactions.DMSOnLeave",
                        foreignField: "_id",
                        as: "dmsonleavingitems"
                    }
            },
            {
                $lookup:
                    {
                        from: "rtdonarriveitems",
                        localField: "bigdatatransactions.RTDOnArrive",
                        foreignField: "_id",
                        as: "rtdonarriveitems"
                    }
            },
            {
                $lookup:
                    {
                        from: "rtdonleavingitems",
                        localField: "bigdatatransactions.RTDOnLeave",
                        foreignField: "_id",
                        as: "rtdonleavingitems"
                    }
            }
        ]).cursor({batchSize: 1}).exec();
    }
    return SpecialOrderPartsTrack;
};
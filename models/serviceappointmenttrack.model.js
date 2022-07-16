module.exports = mongoose => {
    const schema = mongoose.Schema({
        appointmentId: String,
        vin: String,

        internalDealerCode: String,
        customerNumber: String,
        latestTransactionId: String,
        latestDms: String,
        latestTransactionType: String,
        latestOperationDate: {type: Date, default: new Date()},

        appointmentDate: Date,

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

    schema.index({latestOperationDate: -1, appointmentId: 1, customerNumber: 1, internalDealerCode: 1}, {name: "compound_1", background: true});

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const ServiceAppointmentTrack = mongoose.model("serviceappointmentstracks", schema);
    return ServiceAppointmentTrack;
};
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
    return RtdOnArrive;
};
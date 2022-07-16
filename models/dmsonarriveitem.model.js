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
    return DmsOnArrive;
};
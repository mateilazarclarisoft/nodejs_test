module.exports = mongoose => {
    const schema = mongoose.Schema({
        internalTrackingID: String,
        receivedByApplicationServer : Date,
        onArrivalToTheSystem: {type: mongoose.Schema.Types.Mixed}
    });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const ApplicationServerOnArrive = mongoose.model("applicationserveronarriveitems", schema);
    return ApplicationServerOnArrive;
};
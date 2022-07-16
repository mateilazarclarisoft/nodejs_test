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
    return ApplicationServerOnLeave;
};
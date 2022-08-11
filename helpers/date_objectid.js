exports.objectIdFromDate = function (date) {
    return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
};

exports.dateFromObjectId = function (objectId) {
    var date = objectId.getTimestamp();
    return new Date(date);
};
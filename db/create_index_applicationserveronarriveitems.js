use uNotifiBigData;

db.applicationserveronarriveitems.createIndex(
    {
        receivedByApplicationServer:1
    },
    { 
        partialFilterExpression: { "receivedByApplicationServer" : {$gte: new Date("2019-01-01 00:00:00"), $lte: new Date("2019-01-01 23:59:59")} },
        background: true
    }
)
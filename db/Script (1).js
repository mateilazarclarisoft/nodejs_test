use uNotifiBigData;
db.serviceappointmentstracks.aggregate([
    {
        $match: {"latestOperationDate" : {$gte: new Date("2019-01-01 00:00:00"), $lte: new Date("2019-01-31 23:59:59")}}  
    },
    {
        $project: {
            _id: 0
        }
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
                from: "dmsonarriveitems",
                localField: "bigdatatransactions.DMSOnArrive",
                foreignField: "_id",
                as: "dmsonarriveitems"
            }
    },
    {
        $unwind: $dmsonarriveitems
    }
    
])
use uNotifiBigData;
//"_id" : ObjectId("5c2aadc21c647816d983894a"
db.serviceappointmentstracks.aggregate([
    {
        $match: {"latestOperationDate" : {$gte: new Date("2019-02-01 00:00:00"), $lte: new Date("2019-02-01 23:59:59")}}  
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
    },
    {
        $limit:50
    }
])
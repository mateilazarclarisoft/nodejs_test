//db.dealstracks.count( { "latestOperationDate" : { "$lt": new ISODate("2019-03-13T21:18:20.354Z") }})
//db.dealstracks.find({ "latestOperationDate":{$gte : new ISODate("2018-11-16T00:00:00.151Z"), $lte : new ISODate("2018-11-16T23:59:59.151Z")} }).sort( {"latestOperationDate":1}).limit(1)//.toArray().map(function(u){return u.latestOperationDate})
//db.dealstracks.find({ "latestOperationDate":{$exists:true} }).sort( {"latestOperationDate":1}).limit(1)//.toArray().map(function(u){return u.latestOperationDate})
// db.bigdatatransactions.findOne( { "_id" : new ObjectId("5c2aad8a1c647816d9830d7a") })
//db.dealstracks.find({ "latestOperationDate":{$gte : new ISODate("2018-11-16T00:00:00.151Z"), $lte : new ISODate("2018-11-16T23:59:59.151Z")} }).limit(1)
//
//db.bigdatatransactions.aggregate([
//    {
//        $match: { "_id" : new  ObjectId("5c30ea811c647816d94d2796") }
//    },
//    {
//        $lookup: 
//            {
//                from: "applicationserveronarriveitems",
//                localField: "ApplicationServerOnArrive",
//                foreignField: "_id",
//                as: "applicationserveronarriveitems"
//            }
//    }
//]);

db.dealstracks.aggregate([
    {
        $match: { "_id" : new  ObjectId("5c2aad8a1c647816d9830d86") }
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
    
])
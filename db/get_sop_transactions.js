use uNotifiBigData;
 db.specialorderpartstracks.findOne();
 
 
 db.specialorderpartstracks.aggregate([
    {
        $match: { "_id" : new  ObjectId("5c2aada81c647816d9832ea8") }
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
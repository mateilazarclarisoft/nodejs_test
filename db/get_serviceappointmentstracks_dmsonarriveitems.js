use uNotifiBigData;
db.serviceappointmentstracks.aggregate([
    
    {
        $match: {"latestOperationDate" : {$gte: new Date("2019-01-01 00:00:00"), $lte: new Date("2019-01-31 23:59:59")}}  
    },   
    {
        $unwind:"$transactions"
    },
])
.forEach(function(doc) {    
//    print("serviceappointmentstracks:_id" + doc._id)
    db.bigdatatransactions.aggregate([
        {
            $match: {"_id" : doc.transactions}  
        },        
        {
            $lookup: 
                {
                    from: "dmsonarriveitems",
                    localField: "DMSOnArrive",
                    foreignField: "_id",
                    as: "dmsonarriveitems"
                }
        },
    ])
        .forEach(function(docBigDataTransactions){
//            print("bigdatatransactions._id: " + docBigDataTransactions._id)
            docBigDataTransactions.dmsonarriveitems.forEach(function(docDmsonarriveitems){
                  print("dmsonarriveitem._id: " + docDmsonarriveitems._id)  
            })
            
            
        })
  });
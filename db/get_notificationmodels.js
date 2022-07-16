use adminpanelsoapnotification
//db.notificationmodels.getIndexes()
db.notificationmodels.find().sort( {"Body.data.creationDate":-1} ).limit(1)

db.notificationmodels.count({"Body.data.creationDate":{ $lte : new Date("2022-07-01")}})
//db.notificationmodels.count()

db.notificationmodels.findOne();

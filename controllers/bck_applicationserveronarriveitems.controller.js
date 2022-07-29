const mongoose = require('mongoose');
const db = require("../models/db");
const applicationServerOnArriveItem = db.applicationserveronarriveitems;
const fs = require('fs');
const fileUploader = require("../helpers/simple_file_uploader");

// Retrieve all applicationserveronarriveitems from the database.
exports.findAll = async (req, res) => {
    const start = Date.now();
    const queryDate = new Date(Date.UTC(
        +req.params.year,
        +req.params.month - 1,
        +req.params.day
    ));
    const formattedDate = `${req.params.year}${req.params.month}${req.params.day}`;
    
    var fs = require('fs');
    var dir = `tmp/${formattedDate}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const cursor = applicationServerOnArriveItem.getDocumentsByDate(queryDate)
        .exec((error,result)=>{
            if(error){
                res.status(500).send({ message: error.message });
            }
            else{
                fileUploader.process(formattedDate,'applicationserveronarriveitems',JSON.stringify(result))
                    .then(() => {
                        res.send({ "message": result });
                    })
                    .catch(error => {
                        res.status(500).send({ message: error.message });
                    })
                    .finally(() => {
                        console.log(`Time taken: ${Date.now() - start}ms`);
                    })
            }            
        })            
};


var config = require('./config');
var mongoose = require("mongoose");

module.exports = function()
{
    var db = mongoose.connect(config.db);

    console.log("registering mongoose");
    //attach models to mongoose
    require('../app/models/user');
    require('../app/models/linux.server.model');
    
    

    return db;
}


const mongoose = require("mongoose")

const rssiSchema = new mongoose.Schema({
    camNameRx: String,
    camNameTx: String,
    timeDate: String,
    rssi: String
})

rssiSchema.statics = {
    create : function(data, cb) {
      var rssi = new this(data);
      rssi.save(cb);
    },     
    get: function(query, cb) {
      this.find(query, cb);
    },
    getByName: function(query, cb) {
      this.find(query, cb);
    },
    update: function(query, updateData, cb) { 
      this.findOneAndUpdate(query, 
           {$set: updateData},{new: true}, cb);
    },
    delete: function(query, cb) {    
      this.findOneAndDelete(query,cb);
    }
}

module.exports = mongoose.model('RSSI', rssiSchema);
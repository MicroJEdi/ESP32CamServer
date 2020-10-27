const mongoose = require("mongoose")

const cameraSchema = new mongoose.Schema({
    name: String,
    mac: String,
    ipv4: String,
    mode: String,
    iBeaconSent: String,
    isConfigured: String,
    distances: [{
        camName: String,
        distanceMeters: String
    }]
})

cameraSchema.statics = {
    create : function(data, cb) {
      var camera = new this(data);
      camera.save(cb);
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

module.exports = mongoose.model('Camera', cameraSchema);
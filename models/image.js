const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
    camName: String,
    timeDate: String,
    path: String
})

imageSchema.statics = {
    create : function(data, cb) {
      var image = new this(data);
      image.save(cb);
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

module.exports = mongoose.model('Image', imageSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    content: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
});


var listSchema = new Schema({
  title: {type: String, required: true},
  category: {type: String, required: true, default: "General"},
  items: [itemSchema],
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
},{
  timestamps: true
});

module.exports = mongoose.model('Record', recordSchema);
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//todo model
var todoSchema = new Schema({
    title: String,
    finished: { type: Boolean, default: false },
});

mongoose.model('Todo', todoSchema);
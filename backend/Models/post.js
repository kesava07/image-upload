const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    title: String,
    content: String,
    imagePath:String
});

module.exports = mongoose.model('Myposts', postSchema);
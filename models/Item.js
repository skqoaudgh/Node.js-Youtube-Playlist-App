const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    channelTitle: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Item', itemSchema);
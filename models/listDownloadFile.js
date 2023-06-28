const mongoose = require('mongoose');

const ListOfFilesSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('ListOfFile', ListOfFilesSchema);
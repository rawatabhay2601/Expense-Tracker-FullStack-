const mongoose = require('mongoose');

const ForgotpasswordSchema = new mongoose.Schema({
    
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    active: mongoose.Schema.Types.Boolean,
    passwordId: String
});

module.exports = mongoose.model('ForgotPassword',ForgotpasswordSchema);
const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
    
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
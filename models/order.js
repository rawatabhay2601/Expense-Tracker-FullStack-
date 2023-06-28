const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    paymentid : String,
    orderid : String,
    status : String
});

module.exports = mongoose.model('Order', orderSchema);
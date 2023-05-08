const Expense = require('../models/expense');

exports.getExpenses = (where) => {
    return Expense.findAll(where)
};

exports.expensesCount = (where) => {
    return Expense.count(where)
};

exports.deleteExpense = (where) => {
    return Expense.destroy(where)
};
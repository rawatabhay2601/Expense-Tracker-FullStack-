const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expense');

// In Sign-up page if we add the use this is the route that executes that function
router.post('/expense/addExpense', ExpenseController.addExpense);
router.get('/expense/getAllExpenses',ExpenseController.getAllExpenses);
router.get('/expense/deleteExpense/:expensePK',ExpenseController.deleteExpense);

module.exports = router;
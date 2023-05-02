const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expense');
const userAuthorization = require('../middlewares/auth');

// In Sign-up page if we add the use this is the route that executes that function    , ExpenseController.addExpense
router.post('/expense/addExpense', userAuthorization.authenticate, ExpenseController.addExpense);
router.get('/expense/getAllExpenses', userAuthorization.authenticate, ExpenseController.getAllExpenses);
router.get('/expense/deleteExpense/:expensePK',userAuthorization.authenticate, ExpenseController.deleteExpense);

module.exports = router;
const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expense');
const fileUrlController = require('../controllers/listOfFiles');
const userAuthorization = require('../middlewares/auth');

// In Sign-up page if we add the use this is the route that executes that function
router.post('/expense/addExpense', userAuthorization.authenticate, ExpenseController.addExpense);
router.get('/expense/getExpenses', userAuthorization.authenticate, ExpenseController.getExpenses);
router.get('/expense/deleteExpense/:expensePK',userAuthorization.authenticate, ExpenseController.deleteExpense);
router.get('/expense/downloadExpense', userAuthorization.authenticate, ExpenseController.downloadExpense, fileUrlController.addFileUrl);

module.exports = router;
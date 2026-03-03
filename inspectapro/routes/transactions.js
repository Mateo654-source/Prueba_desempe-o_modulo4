const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction } = require('../controllers/transactionController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, getTransactions);
router.post('/', authenticate, createTransaction);

module.exports = router;

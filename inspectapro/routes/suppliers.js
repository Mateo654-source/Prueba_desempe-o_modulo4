const express = require('express');
const router = express.Router();
const { getSuppliers, updateSupplier } = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, getSuppliers);
router.put('/:id', authenticate, authorize('ADMIN'), updateSupplier);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getUsers, getMe } = require('../controllers/userController');
// BUG FIXED: Was '../middleware/auth' (missing 's'), file is in ../middlewares/auth
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('ADMIN'), getUsers);
router.get('/me', authenticate, getMe);

module.exports = router;

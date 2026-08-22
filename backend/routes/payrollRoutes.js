const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/me', payrollController.getMe);
router.get('/', payrollController.getAll);
router.get('/:id', payrollController.getById);
router.post('/', payrollController.create);
router.put('/:id', payrollController.update);

module.exports = router;

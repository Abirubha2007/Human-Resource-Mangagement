const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', leaveController.apply);
router.get('/me', leaveController.getMe);
router.get('/me/balance', leaveController.getBalance);
router.get('/balance/:employeeId', leaveController.getBalance);
router.get('/', leaveController.getAll);
router.get('/:id', leaveController.getById);
router.put('/:id', leaveController.update);
router.patch('/:id/approve', leaveController.approve);
router.patch('/:id/reject', leaveController.reject);

module.exports = router;

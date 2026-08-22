const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/me', attendanceController.getMe);
router.get('/summary', attendanceController.getSummary);
router.get('/', attendanceController.getAll);

module.exports = router;

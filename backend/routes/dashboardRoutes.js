const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/admin', dashboardController.getAdminSummary);
router.get('/employee', dashboardController.getEmployeeSummary);

module.exports = router;

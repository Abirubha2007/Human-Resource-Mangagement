const express = require('express');
const router = express.Router();
const { employeeController } = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Employee Self APIs
router.get('/me', employeeController.getMe);
router.put('/me', employeeController.updateMe);

// Employee CRUD (Admin/HR restricted inside controller)
router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getById);
router.post('/', employeeController.create);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.delete);

module.exports = router;

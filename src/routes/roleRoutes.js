const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { protect } = require('../middleware/auth');

// All routes are protected - user must be authenticated

// Create new role
router.post('/addRole', protect, roleController.createRole);

// Update role
router.post('/updateRole', protect, roleController.updateRole);

// Search roles with pagination and filtering
router.post('/searchRole', protect, roleController.searchRole);

// Delete role
router.post('/deleteRole', protect, roleController.deleteRole);

// Health check
router.get('/role/health', roleController.getHealth);

module.exports = router;

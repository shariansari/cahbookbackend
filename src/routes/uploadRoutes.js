const express = require('express');
const router = express.Router();
const { uploadFile, deleteFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * @route   POST /upload
 * @desc    Upload a file
 * @access  Private
 */
router.post('/upload', protect, upload.single('file'), uploadFile);

/**
 * @route   DELETE /upload/:filename
 * @desc    Delete an uploaded file
 * @access  Private
 */
router.delete('/upload/:filename', protect, deleteFile);

module.exports = router;

/**
 * Upload Controller
 * Handles file upload operations
 */

/**
 * Upload single file
 * @route POST /upload
 * @access Private (requires authentication)
 */
exports.uploadFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        statusCode: 400,
        message: 'No file uploaded',
        error: 'File is required'
      });
    }

    // Get the base URL from request
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    // Construct the file URL
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    // Return success response
    return res.status(200).json({
      statusCode: 200,
      message: 'File uploaded successfully',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'File upload failed',
      error: error.message
    });
  }
};

/**
 * Delete uploaded file
 * @route DELETE /upload/:filename
 * @access Private (requires authentication)
 */
exports.deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const fs = require('fs');
    const path = require('path');

    // Construct file path
    const filePath = path.join('uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        statusCode: 404,
        message: 'File not found',
        error: 'The requested file does not exist'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      statusCode: 200,
      message: 'File deleted successfully',
      data: {
        filename: filename
      }
    });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'File deletion failed',
      error: error.message
    });
  }
};

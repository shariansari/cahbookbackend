const express = require('express');
const router = express.Router();

const { addCashRecord, searchCashRecord, updateCashRecord, getCashRecordStats, deleteCashRecord, searchCashRecords } = require('../controllers/cashRecordController');
const { protect } = require('../middleware/auth');


router.post('/addCashRecord', protect, addCashRecord);

router.post('/searchCashRecord', protect, searchCashRecord);

router.post('/searchCashRecords', protect, searchCashRecords);

router.post('/updateCashRecord', protect, updateCashRecord);

router.post('/deleteCashRecord', protect, deleteCashRecord);

router.post('/statsCashRecord', protect, getCashRecordStats);

module.exports = router;


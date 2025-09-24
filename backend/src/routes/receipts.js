'use strict';

const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const receiptCtrl = require('../controllers/receiptController');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(auth);

router.post('/upload', upload.single('file'), receiptCtrl.upload);

module.exports = router;

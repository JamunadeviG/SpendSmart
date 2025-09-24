const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Send message to Gemini
router.post('/send', chatController.sendMessage);

// Clear chat history
router.post('/clear', chatController.clearHistory);

// Get chat history
router.get('/history', chatController.getHistory);

module.exports = router;

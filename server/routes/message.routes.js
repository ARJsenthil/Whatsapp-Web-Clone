const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

// API endpoints
router.get('/conversations', messageController.getAllConversations);
router.get('/conversations/:wa_id/messages', messageController.getMessagesByConversation);
router.post('/conversations/:wa_id/messages', messageController.sendMessage);

// Webhook endpoint
router.post('/webhook', messageController.webhookHandler);

module.exports = router;
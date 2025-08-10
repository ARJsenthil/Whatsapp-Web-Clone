// server/routes/message.routes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const WebhookProcessor = require('../services/webhookProcessor');

// Webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    await WebhookProcessor.processPayload(req.body);
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoints
router.get('/conversations', messageController.getAllConversations);
router.get('/conversations/:wa_id/messages', messageController.getMessagesByConversation);
router.post('/conversations/:wa_id/messages', messageController.sendMessage);

module.exports = router;
// server/services/webhookProcessor.js
const Message = require('../models/message.model');

class WebhookProcessor {
  static async processPayload(payload) {
    if (payload.payload_type !== 'whatsapp_webhook') return;

    const change = payload.metaData.entry[0].changes[0].value;
    
    if (change.messages) {
      return this.processIncomingMessage(payload, change);
    } else if (change.statuses) {
      return this.processStatusUpdate(payload, change);
    }
  }

  static async processIncomingMessage(payload, change) {
    const messageData = change.messages[0];
    const contact = change.contacts[0];
    const metadata = change.metadata;

    const message = {
      _id: payload._id,
      wa_id: contact.wa_id,
      user_name: contact.profile.name,
      message_id: messageData.id,
      from: messageData.from,
      timestamp: messageData.timestamp,
      text: messageData.text?.body,
      type: messageData.type,
      status: 'sent', // Incoming messages start as 'sent'
      direction: 'inbound',
      metadata: {
        display_phone_number: metadata.display_phone_number,
        phone_number_id: metadata.phone_number_id
      }
    };

    return Message.findOneAndUpdate(
      { _id: message._id },
      message,
      { upsert: true, new: true }
    );
  }

  static async processStatusUpdate(payload, change) {
    const status = change.statuses[0];
    const messageId = status.id || status.meta_msg_id;

    return Message.findOneAndUpdate(
      { $or: [{ message_id: messageId }, { _id: messageId }] },
      { 
        status: status.status,
        statusUpdatedAt: new Date(parseInt(status.timestamp) * 1000)
      },
      { new: true }
    );
  }
}

module.exports = WebhookProcessor;
// server/services/webhookProcessor.js
const Message = require('../models/message.model');

class WebhookProcessor {
  static async processPayload(payload) {
    if (payload.payload_type !== 'whatsapp_webhook') return;
    
    const change = payload.metaData.entry[0].changes[0].value;
    
    // Process message payload
    if (change.messages) {
      return this.processMessagePayload(payload, change);
    }
    // Process status payload
    else if (change.statuses) {
      return this.processStatusPayload(payload, change);
    }
  }

  static async processMessagePayload(payload, change) {
    const messageData = change.messages[0];
    const contact = change.contacts[0];
    
    const message = {
      _id: payload._id,
      wa_id: contact.wa_id,
      user_name: contact.profile.name,
      message_id: messageData.id,
      from: messageData.from,
      timestamp: new Date(parseInt(messageData.timestamp) * 1000),
      text: messageData.text?.body,
      type: messageData.type,
      status: 'sent',
      metadata: {
        display_phone_number: change.metadata.display_phone_number,
        phone_number_id: change.metadata.phone_number_id
      }
    };

    return Message.findOneAndUpdate(
      { _id: message._id },
      message,
      { upsert: true, new: true }
    );
  }

  static async processStatusPayload(payload, change) {
    const status = change.statuses[0];
    const messageId = status.id || status.meta_msg_id;
    
    return Message.findOneAndUpdate(
      { $or: [{ message_id: messageId }, { _id: messageId }] },
      { status: status.status },
      { new: true }
    );
  }
}

module.exports = WebhookProcessor;
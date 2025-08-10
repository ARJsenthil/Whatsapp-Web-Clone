// server/models/message.model.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  wa_id: { type: String, required: true },
  user_name: { type: String, required: true },
  message_id: { type: String },
  from: { type: String, required: true },
  timestamp: { type: Date, required: true },
  text: { type: String },
  type: { type: String, default: 'text' },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  metadata: {
    display_phone_number: String,
    phone_number_id: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  wa_id: { type: String, required: true, index: true },
  user_name: { type: String, required: true },
  message_id: { type: String, index: true },
  from: { type: String, required: true, index: true },
  timestamp: { type: Date, required: true, index: true },
  text: { type: String },
  type: { type: String, default: 'text', enum: ['text', 'image', 'video', 'audio', 'document'] },
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read', 'failed'], 
    default: 'sent' 
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true
  },
  metadata: {
    display_phone_number: String,
    phone_number_id: String
  },
  avatar: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
messageSchema.index({ wa_id: 1, timestamp: -1 });
messageSchema.index({ from: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
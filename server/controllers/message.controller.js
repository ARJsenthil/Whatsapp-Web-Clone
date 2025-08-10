// server/controllers/message.controller.js
const Message = require('../models/message.model');

exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $group: {
          _id: "$wa_id",
          user_name: { $first: "$user_name" },
          last_message: { $last: "$text" },
          last_message_time: { $last: "$timestamp" },
          unread_count: { 
            $sum: { 
              $cond: [
                { $and: [
                  { $ne: ["$from", "$metadata.display_phone_number"] },
                  { $eq: ["$status", "delivered"] }
                ]}, 
                1, 
                0 
              ] 
            } 
          }
        }
      },
      { $sort: { last_message_time: -1 } }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessagesByConversation = async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id })
      .sort({ timestamp: 1 });

    // Mark messages as read if they're from the user
    await Message.updateMany(
      { 
        wa_id: req.params.wa_id,
        from: { $ne: req.query.currentUser },
        status: 'delivered'
      },
      { status: 'read' }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const newMessage = new Message({
      _id: `user-${Date.now()}`,
      wa_id: req.params.wa_id,
      user_name: 'You',
      from: req.body.currentUser,
      timestamp: new Date(),
      text: req.body.text,
      type: 'text',
      status: 'sent',
      metadata: {
        display_phone_number: req.body.currentUser,
        phone_number_id: 'user-generated'
      }
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
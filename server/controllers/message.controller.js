const Message = require('../models/message.model');
const { simulateStatusProgression } = require('../services/messageService');

exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$wa_id",
          user_name: { $first: "$user_name" },
          avatar: { $first: "$avatar" },
          last_message: { $first: "$text" },
          last_message_time: { $first: "$timestamp" },
          unread_count: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ["$direction", "inbound"] },
                    { $ne: ["$status", "read"] }
                  ]
                },
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
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to load conversations' });
  }
};

exports.getMessagesByConversation = async (req, res) => {
  try {
    const { wa_id } = req.params;
    const { currentUser } = req.query;

    // Get messages and mark as read if they're inbound
    const [messages] = await Promise.all([
      Message.find({ wa_id }).sort({ timestamp: 1 }),
      Message.updateMany(
        {
          wa_id,
          direction: 'inbound',
          status: { $in: ['sent', 'delivered'] }
        },
        { $set: { status: 'read' } }
      )
    ]);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to load messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { wa_id } = req.params;
    const { text, currentUser } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Get the most recent message to maintain consistency
    const lastMessage = await Message.findOne({ wa_id })
      .sort({ timestamp: -1 })
      .lean();

    const newMessage = new Message({
      _id: `msg-${Date.now()}`,
      wa_id,
      user_name: lastMessage?.user_name || 'You',
      from: currentUser,
      timestamp: new Date(),
      text: text.trim(),
      type: 'text',
      status: 'sent',
      direction: 'outbound',
      metadata: {
        display_phone_number: currentUser,
        phone_number_id: 'user-generated'
      },
      avatar: lastMessage?.avatar
    });

    await newMessage.save();
    await simulateStatusProgression(newMessage._id);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.webhookHandler = async (req, res) => {
  try {
    const { payload_type, metaData } = req.body;

    if (payload_type !== 'whatsapp_webhook') {
      return res.status(400).json({ error: 'Invalid payload type' });
    }

    const change = metaData.entry[0].changes[0].value;
    
    if (change.messages) {
      await processIncomingMessage(change);
    } else if (change.statuses) {
      await processStatusUpdate(change);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
};

async function processIncomingMessage(change) {
  const messageData = change.messages[0];
  const contact = change.contacts[0];
  const metadata = change.metadata;

  const message = {
    _id: messageData.id,
    wa_id: contact.wa_id,
    user_name: contact.profile.name,
    message_id: messageData.id,
    from: messageData.from,
    timestamp: new Date(parseInt(messageData.timestamp) * 1000),
    text: messageData.text?.body,
    type: messageData.type,
    status: 'delivered',
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

async function processStatusUpdate(change) {
  const status = change.statuses[0];
  
  return Message.findOneAndUpdate(
    { $or: [{ message_id: status.id }, { _id: status.id }] },
    { 
      status: status.status,
      statusUpdatedAt: new Date(parseInt(status.timestamp) * 1000)
    },
    { new: true }
  );
}
const Message = require('../models/message.model');

async function simulateStatusProgression(messageId) {
  try {
    // Update to delivered after 1 second
    setTimeout(async () => {
      await Message.updateOne(
        { _id: messageId },
        { status: 'delivered', statusUpdatedAt: new Date() }
      );

      // Update to read after another 2 seconds (simulating recipient opening chat)
      setTimeout(async () => {
        await Message.updateOne(
          { _id: messageId },
          { status: 'read', statusUpdatedAt: new Date() }
        );
      }, 2000);
    }, 1000);
  } catch (error) {
    console.error('Error in status progression:', error);
  }
}

module.exports = {
  simulateStatusProgression
};
import Message from "../models/messageSchema.js";
import Conversation from "../models/conversationSchema.js";
import { getReceiverSocketId, io } from '../socket/socketIO.js'; // Import both io and getReceiverSocketId

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { receiverId } = req.params;
    const senderId = req.existingUser._id; // Ensure we're using _id for MongoDB documents

    // Find existing conversation or create a new one
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    
    // Save the new message
    await newMessage.save();

    // Add the new message to the conversation and save the conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // socket.io functionality to emit the new message in real time
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage); // Emit to the correct socket ID
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
      newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.id; // Receiver ID from params
    const senderId = req.existingUser._id; // Current logged-in user's ID

    // Find conversation between the sender and the receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages"); // Populate messages for easy retrieval

    if (!conversation) {
      return res.status(200).json([]); // Return an empty array if no conversation exists
    }

    const messages = conversation.messages; // Get the messages array from the conversation
    return res.status(200).json({
      success: true,
      message: 'Messages retrieved successfully!',
      messages,
    });
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

import { errorHandler } from "../utils/error.js";
import Conversation from "../models/Conversation.model.js";

export const getconversation = async (req, res, next) => {
  const username = req.params.username;
  try {
    // Find all conversations where the user is either user1 or user2
    const conversations = await Conversation.find({
      $or: [{ user1: username }, { user2: username }],
    })
      .populate("user1") // Populate user1 field with user details
      .populate("user2"); // Populate user2 field with user details;

    // Do something with the conversations...
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const user1 = req.body.user1;
    const content = req.body.lastMessage.content;
    const user2 = req.body.user2;
    // Create conversation data
    const conversationData = {
      user1: user1,
      user2: user2,
      lastMessage: {
        content: content,
        sender: user1,
      },
    };
    // Save conversation to database
    const newConversation = new Conversation(conversationData);
    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (error) {
    next("error");
  }
};

export const checkConversationExists = async (req, res, next) => {
  try {
    const { user1, user2 } = req.body; // Destructure user1 and user2 from the request body
    // Check if a conversation exists between the two users
    const existingConversation = await Conversation.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 }, // Check for reverse combination as well
      ],
    });
    // Send the result (true if conversation exists, false otherwise)
    res.status(200).json(existingConversation !== null);
  } catch (error) {
    next(error);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const { lastMessage } = req.body;

    const { user1 } = req.body;
    const { user2 } = req.body;
    const conversation = await Conversation.findOneAndUpdate(
      {
        $or: [
          { user1, user2 },
          { user1: user2, user2: user1 }, // Cover both cases where user1 and user2 are in different order
        ],
      },
      // Update the lastMessage field
      {
        lastMessage: lastMessage,
      },
      // Set { new: true } to return the updated document
      { new: true }
    );

    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

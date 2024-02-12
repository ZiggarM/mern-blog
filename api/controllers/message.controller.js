import { errorHandler } from "../utils/error.js";
import Message from "../models/Message.model.js";

export const create = async (req, res, next) => {
  if (!req.body.content) {
    return next(errorHandler(400, "Please provide the message content"));
  }
  const newMessage = new Message({
    senderId: req.user.id, // Assuming the user ID is stored in req.user.id
    receiverId: req.body.receiverId, // Assuming the receiver ID is provided in the request body
    content: req.body.content,
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessagesBetweenUsers = async (req, res, next) => {
  const userId1 = req.params.userId;
  const userId2 = req.params.otherUserId;
  try {
    // Find all messages where senderId is userId1 and receiverId is userId2
    const messagesSentByUser1ToUser2 = await Message.find({
      senderId: userId1,
      receiverId: userId2,
    })
      .populate("senderId", "username")
      .sort({ createdAt: 1 });

    // Find all messages where senderId is userId2 and receiverId is userId1
    const messagesSentByUser2ToUser1 = await Message.find({
      senderId: userId2,
      receiverId: userId1,
    })
      .populate("senderId", "username")
      .sort({ createdAt: 1 });

    // Combine both sets of messages into one array
    const allMessages = [
      ...messagesSentByUser1ToUser2,
      ...messagesSentByUser2ToUser1,
    ];

    res.status(200).json(allMessages);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  const messageId = req.params.messageId;

  try {
    // Find the message by its ID
    const messageToDelete = await Message.findById(messageId);

    if (!messageToDelete) {
      return next(errorHandler(404, "Message not found"));
    }

    // Update the message's isDeleted field to true
    messageToDelete.isDeleted = true;

    // Save the updated message
    const deletedMessage = await messageToDelete.save();

    res.status(200).json(deletedMessage);
  } catch (error) {
    next(error);
  }
};

export const editMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    // Find the message by its ID
    const message = await Message.findById(messageId);

    // Check if the message exists
    if (!message) {
      return next(errorHandler(404, "Message not found"));
    }

    // Save the current content as the old message
    const oldContent = message.content;

    // Update the message with the new content
    message.content = content;
    message.isEdited = true;

    // Push the old content and the timestamp to the editHistory array
    message.editHistory.push({ content: oldContent, editedAt: new Date() });

    // Save the updated message
    const updatedMessage = await message.save();

    res.status(200).json({
      oldMessage: oldContent,
      newMessage: updatedMessage.content,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsernamesTalkedWith = async (req, res, next) => {
  try {
    // Get usernames, user IDs, and is_read where the user is the sender
    const userId = req.user.id;
    const senderMessages = await Message.aggregate([
      {
        $match: { senderId: userId },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $unwind: "$receiver",
      },
      {
        $project: {
          user_id: "$receiver._id",
          username: "$receiver.username",
          is_read: 1,
        },
      },
    ]);

    // Get usernames, user IDs, and is_read where the user is the receiver
    const receiverMessages = await Message.aggregate([
      {
        $match: { receiverId: userId },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $project: {
          user_id: "$sender._id",
          username: "$sender.username",
          is_read: 1,
        },
      },
    ]);

    // Merge the results
    const result = [...senderMessages, ...receiverMessages];

    return result;
  } catch (error) {
    throw new Error("Failed to fetch user messages");
  }
};

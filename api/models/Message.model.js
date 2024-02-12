import mongoose from "mongoose";

const editHistorySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    editedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isEdited: {
      type: Boolean,
      required: true,
      default: false,
    },
    editHistory: [editHistorySchema], // Array to store edit history
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

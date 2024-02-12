import mongoose, { Schema } from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user1: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
    },
    user2: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
    },
    lastMessage: {
      sender: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;

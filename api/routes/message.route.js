import express from "express";
import { verifyToken } from "../utils/VerifyUser.js";
import {
  create,
  deleteMessage,
  editMessage,
  getMessagesBetweenUsers,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get(
  "/getmessagesbetweenusers/:otherUserId/:userId",
  verifyToken,
  getMessagesBetweenUsers
);
router.get(
  "/getusernamestalkedwith/:userId",
  verifyToken,
  getMessagesBetweenUsers
);
router.delete("/deletemessage/:messageId", verifyToken, deleteMessage);
router.put("/editMessag/:messageId", verifyToken, editMessage);

export default router;

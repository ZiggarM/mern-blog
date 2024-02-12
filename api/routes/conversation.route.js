import express from "express";
import { verifyToken } from "../utils/VerifyUser.js";
import {
  getconversation,
  create,
  checkConversationExists,
  updateConversation,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.get("/getconversation/:username", verifyToken, getconversation);
router.post("/create", verifyToken, create);
router.post("/checkconversationexists", verifyToken, checkConversationExists);
router.put("/updateConversation", verifyToken, updateConversation);

export default router;

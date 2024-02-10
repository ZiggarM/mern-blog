import express from "express";
import {
  deleteUSer,
  getUsers,
  signout,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
router.delete("/delete/:userId", verifyToken, deleteUSer);

export default router;

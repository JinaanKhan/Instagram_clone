import express from "express";
import {
  addNewPost,
  likeUnlikePost,
  addComment,
  getAllPosts,
  deletePost
} from "../controllers/post.controller.js";

import upload from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  upload.single("image"),
  addNewPost
);

router.post("/like/:id", isAuthenticated, likeUnlikePost);
router.post("/comment/:id", isAuthenticated, addComment);
router.get("/all", isAuthenticated, getAllPosts);
router.delete("/delete/:id", isAuthenticated, deletePost);

export default router;

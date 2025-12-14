import { Post } from "../model/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import Comment from "../model/comment.model.js";

 export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const img = req.file;
    const authorId = req.id;

     if (!img) {
      return res.status(400).json({
        success: false,
        msg: "Image is required"
      });
    }

     const fileUri = getDataUri(img);

     const cloudResponse = await cloudinary.uploader.upload(
      fileUri.content,
      {
        folder: "insta_posts"
      }
    );

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: req.id    
    });

    return res.status(201).json({
      success: true,
      msg: "Post created successfully",
      post
    });

  } catch (er) {
    console.log(er);
  }
};


export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId); // unlike
    } else {
      post.likes.push(userId); // like
    }

    await post.save();

    return res.status(200).json({
      success: true,
      msg: isLiked ? "Post unliked" : "Post liked"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};


export const addComment = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, msg: "Comment required" });
    }

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId
    });

    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      success: true,
      msg: "Comment added",
      comment
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profilePic")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username profilePic" }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};


export const deletePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        msg: "Not authorized"
      });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      msg: "Post deleted"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};



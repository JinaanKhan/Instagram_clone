import React from "react";
import { likePost } from "../services/api";

const PostCard = ({ post, refreshFeed }) => {

    const handleLike = async () => {
        await likePost(post._id);
        refreshFeed();
    };

    return (
        <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>{post.user.username}</strong></p>
            <img src={post.image} alt="post" width="300" />
            <p>{post.caption}</p>
            <button onClick={handleLike}>❤️ Like</button>
            <p>Likes: {post.likes.length}</p>
        </div>
    );
};

export default PostCard;

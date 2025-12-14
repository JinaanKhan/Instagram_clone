import React, { useState } from "react";
import { createPost } from "../services/api";

const CreatePost = ({ refreshFeed }) => {
    const [image, setImage] = useState("");
    const [caption, setCaption] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPost({ image, caption });
            setImage("");
            setCaption("");
            refreshFeed(); // feed reload
        } catch (err) {
            alert("Post create failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
            <button type="submit">Post</button>
        </form>
    );
};

export default CreatePost;

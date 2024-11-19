import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "../App.css";

const CreatePostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Title is required");

    const { error } = await supabase
      .from("posts")
      .insert([{ title, content, image_url: imageUrl }]);

    if (error) {
      alert("Error creating post");
    } else {
      alert("Post created successfully");
      setTitle("");
      setContent("");
      setImageUrl("");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content (Optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="url"
          placeholder="Image URL (Optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePostForm;

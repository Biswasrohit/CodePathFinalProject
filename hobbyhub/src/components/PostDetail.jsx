import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../App.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
      } else {
        setPost(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setComments(data);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleUpvote = async () => {
    if (post) {
      const { error } = await supabase
        .from("posts")
        .update({ upvotes: post.upvotes + 1 })
        .eq("id", id);

      if (error) {
        console.error("Error updating upvotes:", error);
      } else {
        setPost((prevPost) => ({
          ...prevPost,
          upvotes: prevPost.upvotes + 1,
        }));
      }
    }
  };

  const handleEditPost = async () => {
    const { error } = await supabase
      .from("posts")
      .update({ title: editedTitle, content: editedContent })
      .eq("id", id);

    if (error) {
      console.error("Error updating post:", error);
    } else {
      setIsEditing(false);
      setPost((prevPost) => ({
        ...prevPost,
        title: editedTitle,
        content: editedContent,
      }));
      alert("Post updated successfully");
    }
  };

  const handleDeletePost = async () => {
    const { error: commentsError } = await supabase
      .from("comments")
      .delete()
      .eq("post_id", id);

    if (commentsError) {
      console.error("Error deleting comments:", commentsError);
      return;
    }

    const { error: postError } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (postError) {
      console.error("Error deleting post:", postError);
    } else {
      alert("Post deleted successfully");
      navigate("/");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from("comments")
      .insert([{ post_id: id, content: newComment }]);

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setNewComment("");
      fetchComments();
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-detail">
      {isEditing ? (
        <div className="edit-container">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          ></textarea>
          <button className="save-button" onClick={handleEditPost}>
            Save Changes
          </button>
          <button className="cancel-button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {post.image_url && <img src={post.image_url} alt={post.title} />}
          <p>{post.upvotes} upvotes</p>
          <button className="upvote-button" onClick={handleUpvote}>
            Upvote
          </button>
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button className="delete-button" onClick={handleDeletePost}>
            Delete
          </button>
        </div>
      )}
      <h3>Comments</h3>
      <div className="comments">
        {comments.map((comment, index) => (
          <div className="comment" key={index}>
            <p>{comment.content}</p>
            <p className="comment-time">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <textarea
        className="comment-input"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Leave a comment..."
      ></textarea>
      <button className="submit-comment" onClick={handleAddComment}>
        Submit
      </button>
    </div>
  );
};

export default PostDetail;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../App.css";

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase.from("posts").select("*");

      // Apply sorting
      if (sortBy === "created_at") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "upvotes") {
        query = query.order("upvotes", { ascending: false });
      }

      // Apply search filter
      if (searchQuery.trim() !== "") {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts", error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, [searchQuery, sortBy]);

  return (
    <div className="post-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="sorting-buttons">
        <button onClick={() => setSortBy("created_at")}>Newest</button>
        <button onClick={() => setSortBy("upvotes")}>Most Popular</button>
      </div>
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <p>Posted {new Date(post.created_at).toLocaleString()}</p>
          <h3>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </h3>
          <p>{post.upvotes} upvotes</p>
        </div>
      ))}
    </div>
  );
};

export default HomeFeed;

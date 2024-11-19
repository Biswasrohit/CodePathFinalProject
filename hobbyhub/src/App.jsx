import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeFeed from "./components/HomeFeed";
import CreatePostForm from "./components/CreatePostForm";
import PostDetail from "./components/PostDetail";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/create-post" element={<CreatePostForm />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

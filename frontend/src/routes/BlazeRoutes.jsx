import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../component/auth/Login";
import SignUp from "../component/auth/SignUp";
import HomePage from "../pages/HomePage";
import BlogDetailPage from "../pages/BlogDetailsPage";
import RichTextEditor from "../blog/RichTextEditor";
import AllPostsPage from "../pages/AllBlogPost";
import ProfilePage from "../pages/ProfilePage";
const BlazeRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/blogdetails" element={<BlogDetailPage/>}/>
        <Route path="/write" element={<RichTextEditor/>}/>
        <Route path="/blog"  element={<AllPostsPage/>}/>
        <Route path="/profilepage" element={<ProfilePage/>}/>
      </Routes>
    </>
  );
};

export default BlazeRoutes;

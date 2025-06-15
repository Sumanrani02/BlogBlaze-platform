import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../component/auth/Login";
import SignUp from "../component/auth/SignUp";
import HomePage from "../pages/HomePage";
import BlogDetailPage from "../pages/BlogDetailsPage";
import AllPostsPage from "../pages/AllBlogPost";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "./NotFoundPage";
import CreateBlogPost from "../pages/CreateBlogPost";
const BlazeRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/blog" element={<AllPostsPage />} />
        <Route path="/posts/:id" element={<BlogDetailPage />} />

        {/* Protected Routes */}
        <Route
          path="/write"
          element={
            
              <CreateBlogPost/>
        
          }
        />
        <Route
          path="/profilepage"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-All Route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

    </>
  );
};

export default BlazeRoutes;

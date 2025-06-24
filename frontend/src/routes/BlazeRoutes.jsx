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
import ForgotPassword from "../component/auth/ForgotPassword";
import ResetPassword from "../component/auth/ResetPassword";
import ChangePassword from "../component/auth/ChangePassword";
const BlazeRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/resetpassword/:userId/:token"
          element={<ResetPassword />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/posts" element={<AllPostsPage />} />
        <Route path="/posts/:id" element={<BlogDetailPage />} />

        {/* Protected Routes */}
        <Route
          path="/create-blog"
          element={
            <ProtectedRoute>
              <CreateBlogPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-page"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
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
